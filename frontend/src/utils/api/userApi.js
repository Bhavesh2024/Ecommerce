import axiosInstance from "@/config/axiosInstance";
export const handleUser = async ({
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
			add: "/add",
			update: "/update",
			upload: "/upload",
			remove: `/delete/${id}`,
			users: "/all",
			user: `/${id}`,
		};
		const endpoint = baseEndpoint + endpoints[type];
		console.log(data);
		const response = data
			? await axiosInstance[method](endpoint, data, config)
			: await axiosInstance[method](endpoint, config);

		return response.data;
	} catch (err) {
		throw err?.response?.data?.message || err.message;
	}
};
