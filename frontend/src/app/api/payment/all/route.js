import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
	try {
		const payments = await prisma.payment.findMany({
			orderBy: {
				paidAt: "desc",
			},
			include: {
				order: {
					include: {
						user: true,
						product: true,
					},
				},
			},
		});

		const allPayments = payments.map((payment, index) => ({
			paymentId: payment.paymentId,
			orderId: payment.order?.orderId || null,
			paymentStatus: payment.order.paymentStatus,
			userName: payment.order?.user?.name || "N/A",
			userEmail: payment.order?.user?.email || "N/A",
			userPhone: payment.order?.user?.phone || "N/A",
			productName: payment.order?.product?.name || "N/A",
			amount: `${payment.amount / 100} / ${payment.currency}`,
			type: payment.type,
			provider: payment.provider,
			method: payment.method,
			paidAt: payment.paidAt,
		}));

		if (
			!allPayments ||
			(Array.isArray(allPayments) && allPayments.length == 0)
		) {
			return NextResponse.json(
				{ message: "No Payments Found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{
				message: "Payment Found Successfully",
				payments: allPayments,
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
