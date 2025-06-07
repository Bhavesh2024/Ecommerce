import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { idPattern } from "@/utils/helper/pattern";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
	try {
		const { data } = params;
		const productKey = idPattern.test(data) ? "id" : "slug";
		let product = await prisma.product.findFirst({
			where: {
				[productKey]: data,
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
