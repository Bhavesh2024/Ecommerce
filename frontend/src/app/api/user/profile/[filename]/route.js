import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(req, { params }) {
	const { filename } = params;
	const filePath = path.join(process.cwd(), "uploads/profile/", filename);

	try {
		const file = await fs.readFile(filePath);
		return new NextResponse(file, {
			status: 200,
			headers: {
				"Content-Type": "image/webp",
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch {
		return NextResponse.json(
			{ error: "Image not found" },
			{ status: 404 },
		);
	}
}
