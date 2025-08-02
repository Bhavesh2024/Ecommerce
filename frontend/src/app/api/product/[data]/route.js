import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { idPattern } from "@/utils/helper/pattern";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function GET(req, { params }) {
	try {
		const { data } = params;
		const { value: token } = await cookies().get("upsquareToken");

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
		const { role } = decodedToken;
		const productKey = idPattern.test(data) ? "id" : "slug";

		const baseWhere = {
			[productKey]: data,
		};

		const product = await prisma.product.findFirst({
			where:
				role === "admin"
					? baseWhere
					: {
							...baseWhere,
							status: true,
					  },
		});

		if (!product) {
			return NextResponse.json(
				{ message: "Product Not Found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: "Product Found Successfully", product: product },
			{ status: 200 },
		);
	} catch (err) {
		console.error("Error:", err.message);
		return NextResponse.json(
			{ message: "Something went wrong", error: err.message },
			{ status: 500 },
		);
	}
}
