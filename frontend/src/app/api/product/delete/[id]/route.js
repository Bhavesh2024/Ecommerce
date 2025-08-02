import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {
	isCloudinaryImage,
	getPublicIdFromUrl,
} from "@/utils/helper/cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

		const existingImages = isExist.images || [];

		const removedUrls = existingImages
			.filter((img) => isCloudinaryImage(img.url))
			.map((img) => img.url);

		for (const url of removedUrls) {
			const publicId = getPublicIdFromUrl(url);
			if (!publicId) continue;

			try {
				await cloudinary.uploader.destroy(publicId);
			} catch (err) {
				// Optional: log error if needed
			}
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
		return NextResponse.json(
			{ message: "Something went wrong", error: err.message },
			{ status: 500 },
		);
	}
}
