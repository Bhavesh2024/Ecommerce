"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useOrder = (enabled = true, endpoint) => {
	const fetchOrder = async () => {
		const prefix = "/product/order/";
		const res = await axiosInstance.get(prefix + endpoint, {
			withCredentials: true,
		});
		return res.data;
	};
	return useQuery({
		queryKey: ["order"],
		queryFn: fetchOrder,
		enabled,
		retry: false,
	});
};
