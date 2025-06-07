import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
export async function POST(req) {
	try {
		const { email, password, role } = await req.json();
		const isExist = await prisma.user.findFirst({
			where: {
				email: email,
				role,
			},
		});
		if (!isExist) {
			return NextResponse.json(
				{ message: "Email Not Found" },
				{ status: 404 },
			);
		} else {
			const { id, password: dbPassword, role } = isExist;
			const isMatchedPassword = await bcrypt.compare(
				password,
				dbPassword,
			);
			if (!isMatchedPassword) {
				return NextResponse.json(
					{
						message: "Password Not Matched",
					},
					{ status: 400 },
				);
			}
			const token = jwt.sign({ id, email, role }, SECRET_KEY, {
				expiresIn: role == "customer" ? "30d" : "1d",
			});
			await cookies().set({
				name: "upsquareToken",
				value: token,
				maxAge:
					role == "customer"
						? 60 * 60 * 24 * 30
						: 60 * 60 * 24,
				sameSite: "strict",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});

			return NextResponse.json({ message: "Login Successfully" });
		}
	} catch (err) {
		console.log(err.message);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
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
		const { id } = decodedToken;
		const verifyUser = await prisma.user.findFirst({
			where: {
				id: id,
			},
		});

		if (!verifyUser) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}
		return NextResponse.json(
			{ message: "User Access Granted", user: verifyUser },
			{ status: 200 },
		);
	} catch (err) {
		console.log(err.message);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
