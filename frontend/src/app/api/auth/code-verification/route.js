import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const { otp } = await req.json();
		console.log(otp);
		const user = await prisma.user.findFirst({
			where: { otp: otp },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Verification Code Doesn't Matched" },
				{ status: 400 },
			);
		}

		// Generate Secure Unique Token
		const token = uuidv4();

		// Save token to user or session table
		await prisma.user.update({
			where: { email: user.email },
			data: {
				otp: null,
				token: token, // Ensure this field exists in your Prisma schema
			},
		});

		return NextResponse.json(
			{
				message: "OTP Verified Successfully",
				token,
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
