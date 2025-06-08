import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("image");
		console.log("can we get", formData);
		if (!file || typeof file === "string") {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		const uploadDir = path.join(process.cwd(), "uploads", "profile");

		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}

		const timestamp = Date.now();
		const uniqueId = randomUUID();
		const ext = path.extname(file.name);
		const newFileName = `profile-${timestamp}-${uniqueId}${ext}`;

		const filePath = path.join(uploadDir, newFileName);

		fs.writeFileSync(filePath, buffer);
		const serverUrlPrefix = process.env.UPLOAD_USER_URL;
		const fileUrl = `${serverUrlPrefix}${newFileName}`;
		console.log(fileUrl);
		return NextResponse.json({ image: fileUrl }, { status: 200 });
	} catch (err) {
		console.error("Upload error:", err.message);
		return NextResponse.json(
			{ error: "Upload failed" },
			{ status: 500 },
		);
	}
}
