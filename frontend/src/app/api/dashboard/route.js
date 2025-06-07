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

		console.log({ userCount, productCount });

		const dashboardData = {
			count: {
				user: userCount,
				product: productCount,
				order: orderCount,
			},
		};
		return NextResponse.json({
			message: "Data Get Successfully",
			dashboard: dashboardData,
		});
	} catch (err) {
		console.log(err.message);
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
