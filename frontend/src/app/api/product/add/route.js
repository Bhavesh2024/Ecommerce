import { capitalizeWords } from "@/utils/helper/string";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const {
			title,
			category,
			description,
			defaultPrice,
			prices,
			extras,
			discount,
			stockCount,
			stockStatus,
			images,
			status,
			slug,
		} = await req.json();

		const thumbnailObj = images.find((image) => image.isThumbnail);
		const thumbnail = thumbnailObj ? thumbnailObj.url : images[0].url;

		const isExist = await prisma.product.findFirst({
			where: {
				slug: slug,
			},
		});
		console.log(isExist);

		if (isExist) {
			return NextResponse.json(
				{
					message: "Product Already Exists",
				},
				{ status: 409 },
			);
		}

		const newProduct = await prisma.product.create({
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
		return NextResponse.json(
			{
				message: "Product Added Successfully",
				product: {
					...newProduct,
					title: title,
					defaultPrice: defaultPrice,
				},
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
