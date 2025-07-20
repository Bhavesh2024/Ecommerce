import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(req) {
	try {
		const { email, password } = await req.json();

		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email and Password Required" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findFirst({
			where: { email },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "User Not Found" },
				{ status: 404 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				token: null,
			},
		});

		return NextResponse.json(
			{ message: "Password Reset Successfully" },
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
