"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const usePayment = (enabled = true, endpoint) => {
	const fetchPayment = async () => {
		const prefix = "/payment/";
		const res = await axiosInstance.get(prefix + endpoint, {
			withCredentials: true,
		});
		return res.data;
	};
	return useQuery({
		queryKey: ["payment"],
		queryFn: fetchPayment,
		enabled,
		retry: false,
	});
};
