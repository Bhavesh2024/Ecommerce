import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function DELETE(req, { params }) {
	try {
		const { value: token } = cookies().get("upsquareToken") || {};
		if (!token) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}

		const decodedToken = jwt.verify(token, SECRET_KEY);
		const { id: userId } = decodedToken;
		const notificationId = parseInt(params.id);

		// Verify the notification belongs to the user
		const notification = await prisma.notification.findUnique({
			where: { id: notificationId },
		});

		if (!notification || notification.userId !== userId) {
			return NextResponse.json(
				{ message: "Notification not found or access denied" },
				{ status: 404 },
			);
		}

		await prisma.notification.delete({
			where: { id: notificationId },
		});

		return NextResponse.json(
			{
				message: "Notification deleted successfully",
				id: notificationId,
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
