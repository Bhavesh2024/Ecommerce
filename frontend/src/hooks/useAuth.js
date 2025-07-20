"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useAuth = (endpoint = "login", token = null, enabled = true) => {
	const prefix = "/auth/";
	const authEndPoints = {
		login: "login",
		forgotPassword: `/forgot-password/${token}`,
	};

	const url = prefix + authEndPoints[endpoint];

	const fetchAuthStatus = async () => {
		const res = await axiosInstance.get(url, {
			withCredentials: true,
		});
		return res.data;
	};

	return useQuery({
		queryKey: ["auth", endpoint, token], // Make queryKey unique per endpoint/token
		queryFn: fetchAuthStatus,
		enabled,
		retry: false,
	});
};
