import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req) {
	try {
		const users = await prisma.user.findMany({
			where: {
				role: "customer",
			},
			orderBy: {
				id: "desc",
			},
		});
		if (!users || (Array.isArray(users) && users.length == 0)) {
			return NextResponse.json(
				{ message: "No User Found" },
				{ status: 404 },
			);
		}
		return NextResponse.json(
			{ message: "Users Found Successfully", users: users },
			{ status: 200 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal Server Error", error: err.message },
			{ status: 500 },
		);
	}
}
