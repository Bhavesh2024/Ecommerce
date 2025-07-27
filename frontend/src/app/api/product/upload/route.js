import { NextResponse } from "next/server";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fs from "fs/promises";

export const config = {
	api: {
		bodyParser: false,
	},
};

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

async function uploadToCloudinary(filePath) {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(
			filePath,
			{ folder: "products" }, // optional: save inside a folder
			(error, result) => {
				if (error) reject(error);
				else resolve(result);
			},
		);
	});
}

export async function POST(request) {
	try {
		const form = formidable({
			multiples: true,
			keepExtensions: true,
			maxFileSize: 100 * 1024 * 1024,
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
			: files.image
			? [files.image]
			: [];

		const orders = Array.isArray(fields.order)
			? fields.order
			: fields.order
			? [fields.order]
			: [];

		// Upload all images to Cloudinary
		const uploadedCloudinary = await Promise.all(
			uploaded.map(async (file) => {
				const result = await uploadToCloudinary(file.filepath);
				// Optionally delete local temp file after upload
				await fs.unlink(file.filepath).catch(() => {});
				return result;
			}),
		);

		// Build response same as before, but with cloudinary URLs
		const filePaths = uploadedCloudinary.map((res, index) => ({
			url: res.secure_url,
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
