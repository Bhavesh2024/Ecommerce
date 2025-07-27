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
			where: {
				status: 2,
			},
		});
		const totalRefunds = await prisma.refund.aggregate({
			_sum: {
				amount: true, // Replace with your actual payment field name
			},
		});
		const dashboardData = {
			count: {
				user: userCount,
				product: productCount,
				order: orderCount,
				revenue:
					(totalPayment._sum.amount -
						totalRefunds._sum.amount) /
					100,
				refunds: totalRefunds._sum.amount / 100,
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
