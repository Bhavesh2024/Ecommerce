"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useProduct = (enabled = true, endpoint) => {
	const fetchProduct = async () => {
		const prefix = "/product/";
		const res = await axiosInstance.get(prefix + endpoint, {
			withCredentials: true,
		});
		return res.data;
	};
	return useQuery({
		queryKey: ["product"],
		queryFn: fetchProduct,
		enabled,
		retry: false,
	});
};
