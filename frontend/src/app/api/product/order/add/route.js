import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { razorpayStatus, requestStatus } from "@/utils/helper/status";
import { notificationType, orderRequestMap } from "@/utils/helper/type";
import {
	generateMessage,
	generateOrderSummaryHTML,
} from "@/utils/helper/generator";
import admin from "@/config/firebase/firebaseAdmin";
import { sendMail } from "@/utils/helper/sendMail";
const prisma = new PrismaClient();

export const OrderIdGenerator = async () => {
	try {
		let isUnique = false;
		let orderId = "";
		let counter = 1;

		// Get the most recent order to determine the next ID
		const latestOrder = await prisma.order.findFirst({
			orderBy: { id: "desc" },
		});

		if (latestOrder?.id) {
			counter = latestOrder.id + 1;
		}

		while (!isUnique) {
			const padded = String(counter).padStart(6, "0");
			orderId = `UPSO${padded}`;

			const existingOrder = await prisma.order.findUnique({
				where: { orderId },
			});

			if (!existingOrder) {
				isUnique = true;
			} else {
				counter++;
			}
		}

		return orderId;
	} catch (error) {
		console.error("Error generating order ID:", error);
		throw new Error("Failed to generate unique Order ID");
	}
};

export async function POST(req) {
	let razorpayId = null;
	const razorpay = new Razorpay({
		key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
		key_secret: process.env.RAZORPAY_API_SECRET,
	});
	try {
		const { order, user, product, payment } = await req.json();

		const newOrderId = await OrderIdGenerator();
		const { phone, id: userId, email, address, name: customer } = user;
		const { total, totalUnits } = order.totals;
		const { quantity, variants, extras } = order;
		const { id: productId, name, discount, slug, stockCount } = product;
		const { paymentId, receipt } = payment;
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const adminUser = await prisma.user.findFirst({
			where: {
				role: "admin",
			},
		});
		const existingOrder = await prisma.order.findFirst({
			where: {
				userId: userId,
				productId: productId,
				createdAt: {
					gte: oneHourAgo,
				},
			},
		});

		if (existingOrder) {
			return NextResponse.json(
				{
					message: "Order already placed for this product within the last hour.",
				},
				{ status: 400 },
			);
		}

		const productStock = stockCount - totalUnits;

		if (productStock < 0) {
			return NextResponse.json(
				{ message: "We don't have enough stock" },
				{ status: 409 },
			);
		}
		razorpayId = paymentId;

		const paymentData = await razorpay.payments.fetch(paymentId);
		const razorpayPhone = paymentData.contact;
		if (!paymentData) {
			return NextResponse.json(
				{ message: "No Payment Found" },
				{ status: 404 },
			);
		}

		const transaction = await prisma.$transaction(async (prisma) => {
			const {
				id,
				amount,
				currency,
				status,
				method,
				captured,
				created_at,
				error_code,
				error_description,
			} = paymentData;
			const newOrder = await prisma.order.create({
				data: {
					orderId: newOrderId,
					shippingAddress: address,
					userId: userId,
					productId: productId,
					details: order,
					quantity: quantity,
					phoneNumber: razorpayPhone,
					totalAmount: total,
					paymentStatus: error_code ? 0 : 1,
				},
			});
			const newPayment = await prisma.payment.create({
				data: {
					paymentId: id,
					type: "online",
					amount: amount,
					currency: currency,
					orderId: newOrder.id,
					status: razorpayStatus[status],
					provider: "razorpay",
					method,
					responseCode: error_code ? error_code : "200",
					responseMessage: error_description
						? error_description
						: "Payment Successful",
					captured: captured,
				},
			});

			const newRequest = await prisma.request.create({
				data: {
					orderId: newOrder.id,
					type: 0,
					status: requestStatus["pending"],
				},
			});

			const newNotification = await prisma.notification.create({
				data: {
					type: 0,
					message: `${
						user.name
					} has request ${orderRequestMap[0].toLowerCase()} for ${
						product.name
					}`,
					orderId: newOrder.id,
					requestId: newRequest.id,
					userId: adminUser?.id,
					status: 0,
				},
			});

			return {
				newOrder,
				newPayment,
				newRequest,
				newNotification,
			};
		});

		if (!transaction) {
			await razorpay.payments.refund(paymentId, {
				speed: "optimum", // or 'normal'
			});

			return NextResponse.json(
				{ message: "Order failed. Payment has been refunded." },
				{ status: 500 },
			);
		}

		const { newOrder } = transaction;
		const { id, paymentStatus, orderStatus } = newOrder;

		if (adminUser && adminUser.deviceToken) {
			const { newNotification } = transaction;
			if (adminUser && adminUser.deviceToken) {
				const message = {
					token: adminUser.deviceToken,
					notification: {
						title: "New Order Request",
						body: newNotification.message,
					},
					data: {
						orderId: String(newNotification.orderId),
						type: "request",
						requestId: String(
							newNotification.requestId,
						),
					},
				};
				await admin.messaging().send(message);
			}
		}
		const mailPayload = {
			to: email,
			subject: "orderPlaced",
			template: "newOrder",
			replacements: {
				name: customer,
				orderId: newOrder.orderId,
				summarySection: generateOrderSummaryHTML(order, name),
			},
		};
		await sendMail(mailPayload);
		const orderDetails = {
			id: id,
			orderId: newOrderId,
			productName: name,
			customerName: customer,
			total: total,
			quantity: quantity,
			address: address,
			paymentStatus: paymentStatus,
			orderStatus: orderStatus,
			orderItems: {
				variants: variants,
				extras: extras,
			},
			discount: discount,
			productSlug: slug,
		};
		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				stockCount: productStock,
				stockStatus: productStock < 1 ? 0 : 1,
			},
		});

		return NextResponse.json(
			{ message: "Order Placed Successfully", order: orderDetails },
			{ status: 200 },
		);
	} catch (err) {
		if (razorpayId) {
			try {
				const paymentInfo = await razorpay.payments.fetch(
					razorpayId,
				);

				if (paymentInfo.status === "captured") {
					await razorpay.payments.refund(razorpayId, {
						speed: "optimum",
					});
				} else {
				}
			} catch (refundErr) {}
		}
		return NextResponse.json(
			{ message: "Internal Server Error", err },
			{ status: 500 },
		);
	}
}
