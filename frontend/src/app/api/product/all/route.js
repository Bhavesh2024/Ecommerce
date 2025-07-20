import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const token = await cookies().get("upsquareToken");
		console.log(token);
		const allProducts = await prisma.product.findMany({
			orderBy: {
				id: "desc",
			},
		});

		if (token) {
			const decodedToken = jwt.verify(
				token.value,
				process.env.JWT_SECRET_KEY,
			);
			const { role } = decodedToken;
			if (role == "admin" && allProducts) {
				const extractedProductDetails = allProducts.map(
					({
						name,
						category,
						description,
						price,
						prices,
						extras,
						images,
						thumbnail,
						discount,
						stockCount,
						stockStatus,
						slug,
						status,
						id,
					}) => ({
						id: id,
						title: name,
						category: category,
						description: description,
						defaultPrice: price,
						prices: prices,
						extras: extras,
						thumbnail: thumbnail,
						images: images,
						discount: discount,
						stockCount: stockCount,
						stockStatus: stockStatus,
						status: status,
						slug: slug,
					}),
				);
				return NextResponse.json(
					{
						message: "Products Found Successfully",
						products: extractedProductDetails,
					},
					{ status: 200 },
				);
			}
		}
		if (
			!allProducts ||
			(Array.isArray(allProducts) && allProducts.length == 0)
		) {
			return NextResponse.json(
				{ message: "No Product Found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{
				message: "Products Found Successfully",
				products: allProducts,
			},
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
