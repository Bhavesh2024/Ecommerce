"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useDashboard = (enabled = true) => {
	const fetchData = async () => {
		const res = await axiosInstance.get("/dashboard", {
			withCredentials: true,
		});
		return res.data;
	};

	return useQuery({
		queryKey: ["dashboard"],
		queryFn: fetchData,
		enabled,
		retry: false,
	});
};
