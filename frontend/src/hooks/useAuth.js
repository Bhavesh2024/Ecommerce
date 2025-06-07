"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useAuth = (enabled = true) => {
	const fetchAuthStatus = async () => {
		const res = await axiosInstance.get("/auth/login", {
			withCredentials: true,
		}); // Fixed endpoint
		return res.data;
	};

	return useQuery({
		queryKey: ["auth"],
		queryFn: fetchAuthStatus,
		enabled,
		retry: false, // Optional: disable retry on failure
	});
};
