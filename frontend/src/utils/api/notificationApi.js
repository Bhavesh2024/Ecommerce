import axiosInstance from "@/config/axiosInstance";
export const handleNotification = async ({
	method,
	type,
	data = null,
	id = null,
	headers = {},
}) => {
	try {
		const config = { headers };
		const baseEndpoint = "/notification";
		const endpoints = {
			deviceToken: "/set-fcm-token",
			all: "/all",
			delete: `/delete/${id}`,
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
