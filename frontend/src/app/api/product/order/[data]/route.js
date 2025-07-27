import { idPattern } from "@/utils/helper/pattern";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req, { params }) {
	try {
		const { data } = params;

		let order = null;

		// If the string is all digits, try using it as ID
		if (/^\d+$/.test(data)) {
			order = await prisma.order.findFirst({
				where: { id: parseInt(data) },
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
		}

		// If not found, or data is not numeric, try using as orderId
		if (!order) {
			order = await prisma.order.findFirst({
				where: { orderId: data },
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
		}

		if (!order) {
			return NextResponse.json(
				{ message: "No Order Found" },
				{ status: 404 },
			);
		}

		const orderDetail = {
			id: order.id,
			orderId: order.orderId,
			orderItem: order.details,
			total: order.totalAmount, // You had `totalAmount` but it wasn't defined
			quantity: order.quantity,
			orderStatus: order.orderStatus,
			paymentStatus: order.paymentStatus,
			address: order.shippingAddress,
			product: order.product,
			user: order.user,
			created_at: order.createdAt,
			updated_at: order.updatedAt,
		};

		return NextResponse.json({
			message: "Order Found Successfully",
			order: orderDetail,
		});
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
