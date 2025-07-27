import axiosInstance from "@/config/axiosInstance";
export const updateProfile = async ({
	method,
	type,
	data = null,
	headers = {},
	id = null,
}) => {
	try {
		const config = { headers };
		const baseEndpoint = "/user";
		const endpoints = {
			profile: "/profile",
			upload: "/upload",
		};
		const endpoint = baseEndpoint + endpoints[type];

		const response = data
			? await axiosInstance[method](endpoint, data, config)
			: await axiosInstance[method](endpoint, config);

		return response.data;
	} catch (err) {
		throw err?.response?.data?.message || err.message;
	}
};
