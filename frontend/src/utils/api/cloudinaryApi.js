import axios from "axios";

// Set your Cloudinary values here (or via .env file in frontend-safe way)
const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const cloudinaryEndpoints = {
	upload: `https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`,
	delete: `https://api.cloudinary.com/v1_1/${cloudinaryName}/delete_by_token`, // fallback way
};

export const handleCloudinary = async ({ type, data, headers = {} }) => {
	try {
		const config = { headers };
		const endpoint = cloudinaryEndpoints[type];

		if (!endpoint) throw new Error("Invalid operation type");

		const response =
			type === "upload"
				? await axios.post(endpoint, data, config)
				: await axios.post(endpoint, data, config); // for delete you’ll need either `public_id` or `delete_token`

		return response.data;
	} catch (err) {
		throw err?.response?.data?.error?.message || err.message;
	}
};
