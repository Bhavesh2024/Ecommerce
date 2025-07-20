import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import dayjs from "dayjs";
import admin from "@/config/firebase/firebaseAdmin";
import { refundStatus } from "@/utils/helper/status";
import { notificationType } from "@/utils/helper/type";
import { sendMail } from "@/utils/helper/sendMail";
import { format } from "date-fns";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { formatPrice } from "@/utils/helper/formatter";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function PUT(req) {
	const step = (msg) => console.log(`[Order Update] ${msg}`);

	try {
		const data = await req.json();
		const { id, orderStatus, paymentStatus } = data;
		const { value: token } = await cookies().get("upsquareToken");
		console.log(token);
		if (!token) {
			return NextResponse.json(
				{ message: "Token Not Found" },
				{ status: 404 },
			);
		}
		const decodedToken = jwt.verify(token, SECRET_KEY);
		if (!decodedToken) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}
		const { id: userId } = decodedToken;
		const verifyUser = await prisma.user.findFirst({
			where: {
				id: userId,
			},
		});

		if (verifyUser.role == "admin" && orderStatus == 4) {
			await prisma.order.update({
				where: {
					id: id,
				},
				data: {
					orderStatus: orderStatus,
				},
			});
		}
		step(`Received update request for Order ID: ${id}`);

		const razorpay = new Razorpay({
			key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
			key_secret: process.env.RAZORPAY_API_SECRET,
		});

		const order = await prisma.order.findUnique({
			where: { id },
			include: { user: true, product: true, payments: true },
		});
		if (!order) {
			step(`Order not found`);
			return NextResponse.json(
				{ message: "Order not found" },
				{ status: 404 },
			);
		}

		const today = new Date();
		let refundDetails = null;
		let isRefunded = false;

		// Handle Cancellation with Refund
		if (orderStatus === 4) {
			const payment = await prisma.payment.findFirst({
				where: { orderId: id },
			});
			if (payment?.paymentId) {
				const daysSinceOrder = dayjs().diff(
					dayjs(order.createdAt),
					"day",
				);
				const eligibleForRefund = daysSinceOrder <= 2;

				if (eligibleForRefund) {
					step(`Eligible for refund, initiating refund`);

					const paymentDetails =
						await razorpay.payments.fetch(
							payment.paymentId,
						);
					if (paymentDetails.status === "authorized") {
						await razorpay.payments.capture(
							payment.paymentId,
							paymentDetails.amount,
						);
					}

					const refundResponse =
						await razorpay.payments.refund(
							payment.paymentId,
						);

					const adminUser = await prisma.user.findFirst({
						where: {
							role: "admin",
							deviceToken: { not: null },
						},
					});

					await prisma.$transaction([
						prisma.refund.create({
							data: {
								orderId: id,
								paymentId: payment.id,
								mode: 1,
								refundId: refundResponse.id,
								amount: refundResponse.amount,
								status: refundStatus[
									refundResponse.status
								],
								refundDate: today.toISOString(),
							},
						}),
						prisma.payment.update({
							where: { id: payment.id },
							data: { status: 2 },
						}),
						prisma.order.update({
							where: { id },
							data: {
								paymentStatus: 2,
								orderStatus,
							},
						}),
						...(adminUser?.deviceToken
							? [
									prisma.notification.create(
										{
											data: {
												userId: adminUser.id,
												message: "Order has been cancelled and refunded.",
												type: notificationType[
													"refund"
												],
												orderId: id,
											},
										},
									),
							  ]
							: []),
					]);

					if (adminUser?.deviceToken) {
						step(`Sending push notification to admin`);
						await admin.messaging().send({
							token: adminUser.deviceToken,
							notification: {
								title: "Order Cancelled & Refunded",
								body: "Order has been cancelled and refunded.",
							},
							data: {
								orderId: String(order.id),
								type: "refund",
							},
						});
					}

					isRefunded = true;
					refundDetails = {
						refundId: refundResponse.id,
						amount: refundResponse.amount,
						time: format(today, "dd MMM yyyy hh:mm a"),
					};
				} else {
					step(
						`Refund window expired, cancelling without refund`,
					);
				}
			} else {
				step(`No payment record found for refund`);
			}
		}

		// Standard Order Update
		await prisma.order.update({
			where: { id },
			data: {
				orderStatus,
				...(paymentStatus !== undefined && { paymentStatus }),
			},
		});
		step(`Order status updated successfully`);

		// Prepare refund block (only if orderStatus === 4)
		let refundBlock = "";
		if (orderStatus === 4) {
			if (isRefunded && refundDetails) {
				refundBlock = `
					<table width="100%" cellpadding="10" cellspacing="0" border="0" style="background-color: #f3e8ff; font-family: Arial, sans-serif; border-collapse: collapse; border: 1px solid #ccc; max-width: 600px;">
					<tr>
						<td colspan="2" style="background-color: #9b59b6; color: white; font-weight: bold; text-align: left;">
						Refund Details:
						</td>
					</tr>
					<tr>
						<td style="font-weight: bold; border: 1px solid #ccc;">Refund ID:</td>
						<td style="border: 1px solid #ccc;">${refundDetails.refundId}</td>
					</tr>
					<tr>
						<td style="font-weight: bold; border: 1px solid #ccc;">Amount:</td>
						<td style="border: 1px solid #ccc;">${formatPrice(refundDetails.amount)}</td>
					</tr>
					<tr>
						<td style="font-weight: bold; border: 1px solid #ccc;">Refund Time:</td>
						<td style="border: 1px solid #ccc;">${refundDetails.time}</td>
					</tr>
					</table>
				`;
			} else {
				refundBlock = `
					<div class="no-refund">
						<p>Unfortunately, this cancellation does not qualify for a refund as it exceeds our 48-hour policy window.</p>
					</div>
				`;
			}

			// Send cancellation email once only
			await sendMail({
				to: order.user.email,
				subject: "orderCanceled",
				template: "cancelOrder",
				replacements: {
					name: order.user.name,
					orderId: order.orderId,
					productName: order.product.name,
					orderDate: format(order.createdAt, "dd MMM yyyy"),
					cancelDate: format(today, "dd MMM yyyy"),
					refundBlock,
				},
			});
		}
		if (orderStatus == 3) {
			// Send cancellation email once only
			await sendMail({
				to: order.user.email,
				subject: "orderDelivered",
				template: "deliveredOrder",
				replacements: {
					name: order.user.name,
					orderId: order.orderId,
					productName: order.product.name,
					orderDate: format(order.createdAt, "dd MMM yyyy"),
					deliveryDate: format(today, "dd MMM yyyy"),
					refundBlock,
				},
			});
		}

		// Return updated order
		const updatedOrder = await prisma.order.findFirst({
			where: { id },
			include: {
				product: {
					select: {
						discount: true,
						name: true,
						thumbnail: true,
						slug: true,
						prices: true,
					},
				},
				user: {
					select: {
						name: true,
						phone: true,
						email: true,
						address: true,
					},
				},
			},
		});

		const updatedOrderData = {
			id: updatedOrder.id,
			orderId: updatedOrder.orderId,
			orderItem: updatedOrder.details,
			total: updatedOrder.totalAmount,
			orderStatus: updatedOrder.orderStatus,
			paymentStatus: updatedOrder.paymentStatus,
			address: updatedOrder.shippingAddress,
			product: updatedOrder.product,
			user: updatedOrder.user,
			quantity: updatedOrder.quantity,
			created_at: updatedOrder.createdAt,
			updated_at: updatedOrder.updatedAt,
		};

		return NextResponse.json(
			{
				message:
					orderStatus === 4
						? isRefunded
							? "Order Cancelled and Refund Processed"
							: "Order Cancelled without Refund"
						: "Order Updated Successfully",
				order: updatedOrderData,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(`[Error] ${err.message}`);

		return NextResponse.json(
			{
				message:
					err.error?.description || "Internal Server Error",
				error: err.error?.description || err.message,
			},
			{ status: 500 },
		);
	}
}
