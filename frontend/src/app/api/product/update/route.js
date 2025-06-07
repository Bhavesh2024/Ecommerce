import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(req) {
	try {
		const {
			title,
			category,
			description,
			defaultPrice,
			images,
			prices,
			extras,
			discount,
			stockCount,
			stockStatus,
			slug,
			status: status,
			oldSlug,
			id,
		} = await req.json();
		const thumbnailObj = images.find((image) => image.isThumbnail);
		const thumbnail = thumbnailObj ? thumbnailObj.url : images[0].url;

		if (slug !== oldSlug) {
			const isExist = await prisma.product.findFirst({
				where: {
					slug: slug,
				},
			});

			if (isExist) {
				return NextResponse.json(
					{ message: "Product Already Exist" },
					{ status: 409 },
				);
			}
		}

		await prisma.product.update({
			where: {
				id: id,
			},
			data: {
				name: title,
				description: description,
				price: parseInt(defaultPrice),
				category: category,
				prices: prices,
				extras: extras,
				discount: discount,
				stockCount: stockCount,
				stockStatus: parseInt(stockStatus),
				images: images,
				thumbnail: thumbnail,
				slug: slug,
				status: status,
			},
		});

		const updatedProduct = {
			id: id,
			title: title,
			category: category,
			description: description,
			defaultPrice: defaultPrice,
			prices: prices,
			extras: extras,
			thumbnail: thumbnail,
			images: images,
			discount: discount,
			stockCount: stockCount,
			stockStatus: stockStatus,
			status: status,
			slug: slug,
		};
		return NextResponse.json(
			{
				message: "Product Updated Successfully",
				product: updatedProduct,
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
