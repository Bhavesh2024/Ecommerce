import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
	try {
		const { user, token } = await req.json();
		const existUser = await prisma.user.findFirst({
			where: {
				id: user.id,
			},
		});

		if (!existUser) {
			return NextResponse.json(
				{ message: "Unauthorized User Found" },
				{ status: 401 },
			);
		}

		const updateToken = await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				deviceToken: token,
			},
		});

		return NextResponse.json(
			{ message: "FCM Token Configured Successfully" },
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{
				message: "Internal Server Error",
				error: err.message,
			},
			{ status: 500 },
		);
	}
}
