import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const refunds = await prisma.refund.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				payment: true,
				order: {
					include: {
						user: true,
						product: true,
					},
				},
			},
		});

		const allRefunds = refunds.map((refund, index) => ({
			index: index + 1,
			refundId: refund.refundId,
			paymentId: refund.payment?.paymentId || "N/A",
			orderId: refund.order?.orderId || "N/A",
			productName: refund.order?.product?.name || "N/A",
			user: {
				name: refund.order?.user?.name || "N/A",
				email: refund.order?.user?.email || "N/A",
				phone: refund.order?.user?.phone || "N/A",
			},
			amount: refund.payment.amount / 100,
			currency: refund.payment?.currency,
			mode: refund.payment?.method || "N/A",
			refundDate: refund.refundDate,
		}));

		if (
			!allRefunds ||
			(Array.isArray(allRefunds) && allRefunds.length == 0)
		) {
			return NextResponse.json(
				{ message: "No Refunds Found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{
				message: "Refunds Found Successfully",
				refunds: allRefunds,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
