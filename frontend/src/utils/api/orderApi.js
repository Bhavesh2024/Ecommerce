import axiosInstance from "@/config/axiosInstance";
export const handleOrder = async ({
	method,
	type,
	data = null,
	headers = {},
	id = null,
}) => {
	try {
		const config = { headers };
		const baseEndpoint = "/product/order";
		const endpoints = {
			add: "/add",
			update: "/update",
			remove: `/delete/${id}`,
			products: "/all",
			product: `/${id}`,
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
