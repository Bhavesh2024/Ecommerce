import { cookieOptions } from "@/config/cookieOption";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;
export async function POST(req) {
	try {
		const { value: token } = cookies().get("upsquareToken");

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
		await cookies().set({ ...cookieOptions, value: "" });
		return NextResponse.json(
			{ message: "User Logout Successfully" },
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
