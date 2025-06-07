"use client";

import { useAuth } from "@/hooks/useAuth";
import React from "react";
import Dashboard from "./dashboard/page";
import { usePathname } from "next/navigation";

const DefaultAdmin = () => {
	const { data: user, isLoading, isError, isSuccess } = useAuth(true);
	const path = usePathname();
	return (
		<>
			{(path == "/user/admin" || path == "/user/admin/") && (
				<Dashboard />
			)}
		</>
	);
};

export default DefaultAdmin;
