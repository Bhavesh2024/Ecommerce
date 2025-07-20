import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
	try {
		const token = params.token; // Correct way, no await

		if (!token) {
			return NextResponse.json(
				{ message: "Token Missing" },
				{ status: 400 },
			);
		}
		console.log("my", token);

		const user = await prisma.user.findFirst({
			where: { token: token },
		});

		console.log("user", user);

		if (!user) {
			return NextResponse.json(
				{ message: "Unauthorized User" },
				{ status: 401 },
			);
		}

		return NextResponse.json(
			{
				message: "Token Matched Successfully",
				email: user.email,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
