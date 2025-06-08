import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using your .env variables
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload buffer via upload_stream
function uploadBufferToCloudinary(buffer) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: "profile" }, // optional folder name in Cloudinary
			(error, result) => {
				if (error) return reject(error);
				resolve(result);
			},
		);
		stream.end(buffer);
	});
}

export async function POST(req) {
	try {
		const formData = await req.formData();
		const file = formData.get("image");

		if (!file || typeof file === "string") {
			return NextResponse.json(
				{ error: "No file uploaded" },
				{ status: 400 },
			);
		}

		// Convert the uploaded file to buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Upload buffer to Cloudinary
		const result = await uploadBufferToCloudinary(buffer);

		// Return the secure URL of the uploaded image
		return NextResponse.json(
			{ image: result.secure_url },
			{ status: 200 },
		);
	} catch (err) {
		console.error("Upload error:", err.message);
		return NextResponse.json(
			{ error: "Upload failed" },
			{ status: 500 },
		);
	}
}
