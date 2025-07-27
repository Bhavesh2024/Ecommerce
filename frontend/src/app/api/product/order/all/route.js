import { PrismaClient } from "@prisma/client";
// import { cookies } from "next/headers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const cookieStore = cookies();
		const token = cookieStore.get("upsquareToken");

		if (!token) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}

		const { value } = token;

		const user = jwt.verify(value, process.env.JWT_SECRET_KEY);

		if (!user) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}

		const { id, role } = user;

		let orders = [];

		if (role == "customer") {
			orders = await prisma.order.findMany({
				orderBy: {
					id: "desc",
				},
				where: {
					userId: id,
				},
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
				},
			});
		} else {
			orders = await prisma.order.findMany({
				orderBy: {
					id: "desc",
				},
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
		if (!orders || (Array.isArray(orders) && orders.length == 0)) {
			return NextResponse.json(
				{ message: "No Orders Found" },
				{ status: 404 },
			);
		}
		const extractedOrders = orders.map((order) => ({
			id: order.id,
			orderId: order.orderId,
			orderItem: order.details,
			total: order.totalAmount,
			orderStatus: order.orderStatus,
			paymentStatus: order.paymentStatus,
			address: order.shippingAddress,
			product: order.product,
			user: order.user,
			quantity: order.quantity,
			created_at: order.createdAt,
			updated_at: order.updatedAt,
		}));

		return NextResponse.json(
			{
				message: "Orders Found Successfully",
				orders: extractedOrders,
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
