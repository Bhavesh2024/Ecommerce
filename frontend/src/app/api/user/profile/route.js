import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

function isCloudinaryProfileImage(url) {
	return (
		url.includes("res.cloudinary.com") &&
		url.includes("/upload/") &&
		url.includes("/profile/")
	);
}

function getPublicIdFromUrl(url) {
	try {
		const withoutExtension = url.substring(0, url.lastIndexOf("."));
		const parts = withoutExtension.split("/upload/");
		if (parts.length < 2) return null;

		const afterUpload = parts[1];
		const afterVersion = afterUpload.replace(/^v\d+\//, ""); // remove version number
		return afterVersion;
	} catch (err) {
		return null;
	}
}

export async function PUT(req) {
	try {
		const {
			name,
			email,
			phone,
			image,
			addresses,
			gender,
			birthDate,
			id,
			oldEmail,
			oldPhone,
		} = await req.json();

		const { value: token } = cookies().get("upsquareToken") || {};

		if (!token) {
			return NextResponse.json(
				{ message: "Unauthorized: No token found" },
				{ status: 401 },
			);
		}

		const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const isExistUser = await prisma.user.findFirst({
			where: { id: user.id },
		});

		if (!isExistUser) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}

		if (oldEmail !== email) {
			const checkMailExist = await prisma.user.findFirst({
				where: { email },
			});
			if (checkMailExist) {
				return NextResponse.json(
					{ message: "Email Already Exist" },
					{ status: 409 },
				);
			}
		}

		if (oldPhone !== phone) {
			const checkPhoneExist = await prisma.user.findFirst({
				where: { phone },
			});
			if (checkPhoneExist) {
				return NextResponse.json(
					{ message: "Phone Number Already Exist" },
					{ status: 409 },
				);
			}
		}

		// If old image is Cloudinary and different from new image, delete it
		if (
			image !== null &&
			isCloudinaryProfileImage(isExistUser.image) &&
			isExistUser.image !== image
		) {
			const publicId = getPublicIdFromUrl(isExistUser.image);
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(publicId);
				} catch (err) {}
			}
		}

		// Update user profile
		await prisma.user.update({
			where: { id },
			data: {
				name,
				email,
				gender,
				address: addresses,
				phone,
				image,
				birthDate: new Date(birthDate).toISOString(),
			},
		});

		const updatedUser = await prisma.user.findFirst({
			where: { id },
		});

		return NextResponse.json(
			{
				message: "Profile Updated Successfully",
				user: updatedUser,
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", err: err.message },
			{ status: 500 },
		);
	}
}
