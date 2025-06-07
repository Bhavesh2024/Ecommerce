import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
	try {
		const data = await req.json();
		const { id, orderStatus, paymentStatus } = data;
		await prisma.order.update({
			where: {
				id: id,
			},
			data: {
				orderStatus: orderStatus,
				paymentStatus: paymentStatus,
			},
		});
		// const newOrderId = await OrderIdGenerator();
		// const { phone, id: userId, address, name: customer } = user;
		// const { total, totalUnits } = order.totals;
		// const { quantity, variants, extras } = order;
		// const { id: productId, name, discount, slug, stockCount } = product;

		// const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago

		// const existingOrder = await prisma.order.findFirst({
		//     where: {
		//         userId: userId,
		//         productId: productId,
		//         createdAt: {
		//             gte: oneHourAgo,
		//         },
		//     },
		// });

		// if (existingOrder) {
		//     return NextResponse.json(
		//         {
		//             message: "Order already placed for this product within the last hour.",
		//         },
		//         { status: 400 },
		//     );
		// }

		// const productStock = stockCount - totalUnits;

		// if (productStock < 0) {
		//     return NextResponse.json(
		//         { message: "We don't have enough stock" },
		//         { status: 409 },
		//     );
		// }

		// const newOrder = await prisma.order.create({
		//     data: {
		//         orderId: newOrderId,
		//         shippingAddress: address,
		//         userId: userId,
		//         productId: productId,
		//         details: order,
		//         quantity: quantity,
		//         phoneNumber: phone,
		//         totalAmount: total,
		//     },
		// });

		// const { id, paymentStatus, orderStatus } = newOrder;
		// const orderDetails = {
		//     id: id,
		//     orderId: newOrderId,
		//     productName: name,
		//     customerName: customer,
		//     total: total,
		//     quantity: quantity,
		//     address: address,
		//     paymentStatus: paymentStatus,
		//     orderStatus: orderStatus,
		//     orderItems: {
		//         variants: variants,
		//         extras: extras,
		//     },
		//     discount: discount,
		//     productSlug: slug,
		// };
		// await prisma.product.update({
		//     where: {
		//         id: productId,
		//     },
		//     data: {
		//         stockCount: productStock,
		//         stockStatus: productStock < 1 ? 0 : 1,
		//     },
		// });

		return NextResponse.json(
			{ message: "Order Updated Successfully", order: data },
			{ status: 200 },
		);
	} catch (err) {
		console.log(err.message);
		return NextResponse.json(
			{ message: "Internal Server Error", err },
			{ status: 500 },
		);
	}
}
