import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const { amount } = await req.json();
		const razorpay = new Razorpay({
			key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
			key_secret: process.env.RAZORPAY_API_SECRET,
		});
		const receipt = "UPSOR" + Date.now();
		const order = await razorpay.orders.create({
			amount: amount,
			currency: "INR",
			receipt: receipt,
			payment_capture: 1,
		});

		return NextResponse.json(
			{
				message: "Order Id Generated",
				orderId: order.id,
				amount: amount,
				receipt: receipt,
			},
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json({
			message: "Internal Server Error",
			error: err.message,
		});
	}
}
