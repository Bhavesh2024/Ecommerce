"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/config/axiosInstance";

export const useNotification = ({
	limit = 20,
	skip = 0,
	enabled = true,
	link,
}) => {
	const fetchNotification = async () => {
		const res = await axiosInstance.get(`/notification/${link}`, {
			withCredentials: true,
			params: { limit, skip },
		});
		return res.data;
	};

	return useQuery({
		queryKey: ["notification", limit, skip],
		queryFn: fetchNotification,
		enabled,
		retry: false,
	});
};
