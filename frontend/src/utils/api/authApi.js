import axiosInstance from "@/config/axiosInstance";
export const handleAuth = async ({
	method,
	type,
	data = null,
	headers = {},
}) => {
	try {
		const config = { headers };
		const baseEndpoint = "/auth";
		const endpoints = {
			register: "/register",
			login: "/login",
			logout: "/logout",
			logout: "/logout",
			verification: "/verification",
			otpVerification: "/code-verification",
			resetPassword: "/reset-password",
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
