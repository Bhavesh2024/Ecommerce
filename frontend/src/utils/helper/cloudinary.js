export function isCloudinaryImage(url) {
	return url.includes("res.cloudinary.com") && url.includes("/upload/");
}

export function getPublicIdFromUrl(url) {
	try {
		const withoutExtension = url.substring(0, url.lastIndexOf("."));
		const parts = withoutExtension.split("/upload/");
		if (parts.length < 2) return null;

		const afterUpload = parts[1];
		const afterVersion = afterUpload.replace(/^v\d+\//, ""); // remove version number
		return afterVersion;
	} catch (err) {
		return null;
	}
}
