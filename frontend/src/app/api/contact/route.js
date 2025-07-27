import { sendMail } from "@/utils/helper/sendMail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req, { params }) {
	try {
		const { email, name, message } = await req.json();
		const existUser = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		let replaces;
		if (existUser) {
			const { name, email, phone } = existUser;
			replaces = {
				name: name,
				email: email,
				phone: phone,
				message: message,
			};
		} else {
			replaces = {
				name: name,
				email: email,
				message: message,
				phone: "",
			};
		}

		const { error } = await sendMail({
			to: process.env.MAIL_USER,
			subject: "contactMail",
			template: "contact",
			replacements: replaces,
		});
		if (error) {
			return NextResponse.json(
				{
					success: false,
					message: "Sorry, Contact Mail could not be sent. Please try again later.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: "Thank you for contacting us. We will reach out to you shortly.",
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
