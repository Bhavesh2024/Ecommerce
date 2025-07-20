import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function GET(req) {
	try {
		const { value: token } = cookies().get("upsquareToken") || {};
		if (!token) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}

		const decodedToken = jwt.verify(token, SECRET_KEY);
		const { id } = decodedToken;

		// Get pagination values from query params
		const { searchParams } = new URL(req.url);
		const limit = parseInt(searchParams.get("limit")) || 20;
		const skip = parseInt(searchParams.get("skip")) || 0;

		// Fetch notifications and count in parallel
		const [notifications, totalCount] = await Promise.all([
			prisma.notification.findMany({
				where: {
					userId: id,
				},
				orderBy: { createdAt: "desc" },
				take: limit,
				skip: skip,
				include: {
					order: {
						select: {
							id: true,
							user: {
								select: {
									id: true,
									name: true,
									image: true,
									email: true,
								},
							},
						},
					},
				},
			}),
			prisma.notification.count({
				where: { userId: id },
			}),
		]);

		if (!notifications || notifications.length === 0) {
			return NextResponse.json(
				{ message: "No Notifications Found" },
				{ status: 404 },
			);
		}

		// Format notifications to return user data from order
		const transformedNotifications = notifications.map(
			(notification) => ({
				...notification,
				orderId: notification.order?.id,
				userId: notification.order?.user?.id,
				user: notification.order?.user
					? {
							id: notification.order.user.id,
							name: notification.order.user.name,
							image: notification.order.user.image,
							email: notification.order.user.email,
					  }
					: null,
			}),
		);

		return NextResponse.json(
			{
				message: "Notifications fetched successfully",
				notifications: transformedNotifications,
				totalCount,
				hasMore: skip + limit < totalCount,
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
