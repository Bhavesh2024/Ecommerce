import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/utils/helper/sendMail";

const prisma = new PrismaClient();
const SALT_ROUND = 10;

export async function POST(req) {
	try {
		const { name, birthDate, gender, contact, email, password, terms } =
			await req.json();

		const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
		const formattedDate = new Date(birthDate);

		const isExist = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { phone: contact }],
			},
		});

		if (isExist) {
			if (isExist.phone === contact) {
				return NextResponse.json(
					{ message: "Phone Number Already Exists" },
					{ status: 409 },
				);
			}
			if (isExist.email === email) {
				return NextResponse.json(
					{ message: "Email Already Exists" },
					{ status: 409 },
				);
			}
		}

		const newUser = await prisma.user.create({
			data: {
				name,
				birthDate: formattedDate.toISOString(),
				gender,
				phone: contact,
				email,
				password: hashedPassword,
				agreeTerms: terms,
			},
		});
		const mailPayload = {
			to: email,
			subject: "welcome",
			template: "register",
			replacements: {
				name: name.split(" ")[0],
			},
		};
		await sendMail(mailPayload);
		return NextResponse.json(
			{ message: "User Registered Successfully", user: newUser },
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Something went wrong", error: err.message },
			{ status: 500 },
		);
	}
}
