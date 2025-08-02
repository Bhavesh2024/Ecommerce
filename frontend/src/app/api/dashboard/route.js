import { capitalizeWords } from "@/utils/helper/string";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
	try {
		const [userCount, productCount, orderCount] = await Promise.all([
			prisma.user.count(),
			prisma.product.count(),
			prisma.order.count(),
		]);
		const totalPayment = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
		});
		const totalRefunds = await prisma.refund.aggregate({
			_sum: {
				amount: true, // Replace with your actual payment field name
			},
		});
		const paymentAmount = totalPayment._sum.amount ?? 0;
		const refundAmount = totalRefunds._sum.amount ?? 0;

		const dashboardData = {
			count: {
				user: userCount,
				product: productCount,
				order: orderCount,
				revenue: (paymentAmount - refundAmount) / 100,
				refunds: refundAmount / 100,
			},
		};

		return NextResponse.json({
			message: "Data Get Successfully",
			dashboard: dashboardData,
		});
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
