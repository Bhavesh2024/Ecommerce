import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import {
	getPublicIdFromUrl,
	isCloudinaryImage,
} from "@/utils/helper/cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
	try {
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ message: "User ID is required" },
				{ status: 400 },
			);
		}

		const isExist = await prisma.user.findUnique({
			where: { id: parseInt(id) },
		});

		if (!isExist) {
			return NextResponse.json(
				{ message: "User Not Found" },
				{ status: 404 },
			);
		}

		const profileImage = isExist?.image;

		if (profileImage && isCloudinaryImage(profileImage)) {
			const publicId = getPublicIdFromUrl(profileImage);
			if (publicId) {
				await cloudinary.uploader.destroy(publicId);
			}
		}

		await prisma.user.delete({
			where: { id: parseInt(id) },
		});

		return NextResponse.json(
			{
				message: "User Deleted Successfully",
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
