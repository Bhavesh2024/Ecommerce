import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
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
		const { value: token } = await cookies().get("upsquareToken");

		const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const isExistUser = await prisma.user.findFirst({
			where: {
				id: user.id,
			},
		});

		if (!isExistUser) {
			return NextResponse.json(
				{ message: "Unauthorized Access" },
				{ status: 401 },
			);
		}
		if (oldEmail !== email) {
			const checkMailExist = await prisma.user.findFirst({
				where: {
					email: email,
				},
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
				where: {
					phone: phone,
				},
			});
			if (checkPhoneExist) {
				return NextResponse.json(
					{ message: "Phone Number Already Exist" },
					{ status: 409 },
				);
			}
		}

		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				name: name,
				email: email,
				gender: gender,
				address: addresses,
				phone: phone,
				image: image,
				birthDate: new Date(birthDate).toISOString(),
			},
		});

		const updatedUser = await prisma.user.findFirst({
			where: {
				id: id,
			},
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
