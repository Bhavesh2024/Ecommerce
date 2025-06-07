import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ message: "Product ID is required" },
				{ status: 400 },
			);
		}

		const isExist = await prisma.product.findUnique({
			where: { id: parseInt(id) },
		});

		if (!isExist) {
			return NextResponse.json(
				{ message: "Product Not Found" },
				{ status: 404 },
			);
		}

		await prisma.product.delete({
			where: { id: parseInt(id) },
		});

		return NextResponse.json(
			{
				message: "Product Deleted Successfully",
				id,
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
