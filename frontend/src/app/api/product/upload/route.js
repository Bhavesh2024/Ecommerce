import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";

export const config = {
	api: {
		bodyParser: false,
	},
};

const uploadDir = path.join(process.cwd(), "uploads");

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
		});

		const nodeRequest = streamToNodeReadable(request.body);
		nodeRequest.headers = Object.fromEntries(request.headers);
		nodeRequest.method = request.method;

		const [fields, files] = await new Promise((resolve, reject) => {
			form.parse(nodeRequest, (err, fields, files) => {
				if (err) {
					console.error("Formidable parsing error:", err);
					return reject(err);
				}
				resolve([fields, files]);
			});
		});

		const uploaded = Array.isArray(files.image)
			? files.image
			: [files.image];
		const orders = Array.isArray(fields.order)
			? fields.order
			: [fields.order];

		const imageFiles = uploaded.filter((file) =>
			file.mimetype?.startsWith("image/"),
		);

		const filePaths = imageFiles.map(({ newFilename }, index) => ({
			url: `${process.env.UPLOAD_IMAGE_URL}${newFilename}`,
			order: orders[index] ?? null,
		}));

		return NextResponse.json(filePaths);
	} catch (error) {
		console.error("Upload failed:", error);
		return NextResponse.json(
			{ error: "Image upload failed", details: error.message },
			{ status: 500 },
		);
	}
}
