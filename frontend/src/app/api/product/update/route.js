import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {
	isCloudinaryImage,
	getPublicIdFromUrl,
} from "@/utils/helper/cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function PUT(req) {
	try {
		const {
			title,
			category,
			description,
			defaultPrice,
			images: newImages,
			prices,
			extras,
			discount,
			stockCount,
			stockStatus,
			slug,
			status,
			oldSlug,
			id,
		} = await req.json();

		const existingProduct = await prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 },
			);
		}

		const oldImages = existingProduct.images || [];
		const oldUrls = oldImages.map((img) => img.url);
		const newUrls = newImages.map((img) => img.url);
		const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));

		for (const url of removedUrls) {
			if (!isCloudinaryImage(url)) continue;

			const publicId = getPublicIdFromUrl(url);
			if (!publicId) continue;

			try {
				await cloudinary.uploader.destroy(publicId);
			} catch (err) {}
		}

		const thumbnailObj = newImages.find((img) => img.isThumbnail);
		const thumbnail = thumbnailObj
			? thumbnailObj.url
			: newImages[0]?.url || "";

		if (slug !== oldSlug) {
			const isExist = await prisma.product.findFirst({
				where: { slug },
			});
			if (isExist) {
				return NextResponse.json(
					{ message: "Product Already Exist" },
					{ status: 409 },
				);
			}
		}

		await prisma.product.update({
			where: { id },
			data: {
				name: title,
				description,
				price: parseInt(defaultPrice),
				category,
				prices,
				extras,
				discount,
				stockCount,
				stockStatus: parseInt(stockStatus),
				images: newImages,
				thumbnail,
				slug,
				status,
			},
		});

		return NextResponse.json(
			{
				message: "Product Updated Successfully",
				product: {
					id,
					title,
					category,
					description,
					defaultPrice,
					prices,
					extras,
					thumbnail,
					images: newImages,
					discount,
					stockCount,
					stockStatus,
					status,
					slug,
				},
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
