import axiosInstance from "@/config/axiosInstance";
export const handleContact = async ({
	method,
	type = "",
	data = null,
	headers = {},
}) => {
	try {
		const config = { headers };
		const baseEndpoint = "/contact";
		const endpoints = {
			send: "",
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
