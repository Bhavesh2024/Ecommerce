import { generateOTP } from "@/utils/helper/generator";
import { sendMail } from "@/utils/helper/sendMail";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req) {
	try {
		const { email, role } = await req.json();
		console.log(email);
		const user = await prisma.user.findFirst({
			where: {
				email,
				role,
			},
		});

		if (!user) {
			return NextResponse.json(
				{
					message: "Email Not Found",
				},
				{ status: 404 },
			);
		}
		let otp;
		let isUnique = false;

		do {
			otp = generateOTP();

			// Check if OTP already exists
			const existingUser = await prisma.user.findFirst({
				where: { otp },
			});

			if (!existingUser) {
				isUnique = true;
				// Save unique OTP
				await prisma.user.update({
					where: { id: user.id },
					data: { otp },
				});
			}
		} while (!isUnique);

		const mailPayload = {
			to: user.email,
			subject: "passwordReset",
			template: "otpVerification",
			replacements: {
				username: user.name,
				verificationCode: otp,
			},
		};
		const { error } = await sendMail(mailPayload);
		if (error) {
			return NextResponse.json(
				{
					message: "Verification Mail Not Sent ! Try Again",
				},
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ message: "Verification Code Sent Successfully" },
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
