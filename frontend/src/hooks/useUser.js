"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useUser = (enabled = true, endpoint) => {
	const fetchUser = async () => {
		const prefix = "/user/";
		const res = await axiosInstance.get(prefix + endpoint, {
			withCredentials: true,
		});
		return res.data;
	};
	return useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		enabled,
		retry: false,
	});
};
