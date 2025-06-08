export const runtime = "nodejs"; // important for formidable to work

import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const config = {
	api: {
		bodyParser: false, // disable default Next.js body parser
	},
};

const uploadDir = path.join(process.cwd(), "uploads", "products");

function streamToNodeReadable(webStream) {
	const reader = webStream.getReader();
	return new Readable({
		async read() {
			try {
				const { done, value } = await reader.read();
				if (done) this.push(null);
				else this.push(value);
			} catch (err) {
				this.destroy(err);
			}
		},
	});
}

export async function POST(request) {
	try {
		await fs.mkdir(uploadDir, { recursive: true });

		const form = formidable({
			multiples: true,
			uploadDir,
			keepExtensions: true,
			maxFileSize: 10 * 1024 * 1024, // 10 MB max file size
		});

		const nodeRequest = streamToNodeReadable(request.body);
		nodeRequest.headers = Object.fromEntries(request.headers);
		nodeRequest.method = request.method;

		const [fields, files] = await new Promise((resolve, reject) => {
			form.parse(nodeRequest, (err, fields, files) => {
				if (err) return reject(err);
				resolve([fields, files]);
			});
		});

		// Normalize files.image to always be an array
		const uploadedFiles = Array.isArray(files.image)
			? files.image
			: files.image
			? [files.image]
			: [];

		// Map file info to simple response objects
		const fileDetails = uploadedFiles.map(
			({ newFilename, originalFilename, size }) => ({
				filename: newFilename,
				originalName: originalFilename,
				size,
			}),
		);

		// Return success with files info even if empty array
		return NextResponse.json(
			{
				files: fileDetails,
			},
			{ status: 200 },
		);
	} catch (error) {
		// Return error with empty files array (never crash)
		return NextResponse.json({
			success: false,
			error: error.message,
			files: [],
		});
	}
}
