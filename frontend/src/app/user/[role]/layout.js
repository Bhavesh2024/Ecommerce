"use client";

import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import { handleAuth } from "@/utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import { X, LogOut } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { initFCM } from "@/hooks/notification/usePushNotification";
import { defaultImage } from "@/utils/helper/web-content";
import { renderUserActivities } from "@/utils/helper/sidebar";
import AdminNav from "@/layout/navbar/AdminNav";
import { handleNotification } from "@/utils/api/notificationApi";
import Sidebar from "@/layout/sidebar/Sidebar";

const UserLayout = ({ children }) => {
	const [sidebar, setSidebar] = useState(false);
	// const [openDropdown, setOpenDropdown] = useState(false);
	// const dropdownRef = useRef(0);
	const router = useRouter();
	const path = usePathname();
	const { role } = useParams();
	// const [toggleNotification, setToggleNotification] = useState(false);
	const layoutRestrictedRoutesList = [
		`/user/${role}/auth/signup`,
		`/user/${role}/auth/login`,
		`/user/${role}/auth/verification`,
		`/user/${role}/auth/otp-verification`,
	];

	const isForgotPasswordRoute = path.startsWith(
		`/user/${role}/auth/forgot-password`,
	);
	const isProtected = useMemo(() => {
		if (
			isForgotPasswordRoute ||
			layoutRestrictedRoutesList.includes(path)
		)
			return false;
		return true;
	}, [path]);
	const { user } = useAdminStoreState();
	const { setValue } = useAdminStoreActions();
	const { data, isLoading, isSuccess, isError } = useAuth(
		"login",
		"",
		isProtected,
	);

	const { mutate: logoutMutation, isSuccess: isLogoutSuccess } =
		useMutation({
			mutationFn: handleAuth,
			onSuccess: (data) => {
				router.push("/user/admin/auth/login");
			},
			onError: (error) => {
				console.log("Error", error.message);
			},
		});

	/* Handler Method */
	const handleLogout = () => {
		logoutMutation({ method: "post", type: "logout" });
	};

	useEffect(() => {
		if (isLogoutSuccess) {
			setSidebar(false);
			// setOpenDropdown(false);
		}
	}, [isLogoutSuccess]);

	const setupFCM = async (user) => {
		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				const token = await initFCM();
				notificationMutation({
					method: "put",
					type: "deviceToken",
					data: { token, user },
				});
			}
		} catch (err) {
			console.error("FCM Token Not Configured");
		}
	};

	const { mutate: notificationMutation } = useMutation({
		mutationFn: handleNotification,
		onSuccess: (data) => {
			console.log("Notification Enabled");
		},
		onError: (error) => {
			console.log("Error", error.message);
		},
	});

	useEffect(() => {
		if (isSuccess && data) {
			if (!isForgotPasswordRoute) {
				const { user } = data;
				if (user.role == "admin") {
					setupFCM(user);
				}
				setValue("user", user);
			}
		}
	}, [isSuccess, data]);
	// Effect Hooks
	useEffect(() => {
		if (typeof window !== "undefined") {
			setSidebar(window.matchMedia("(min-width:768px)").matches);
		}
	}, []);

	return (
		<>
			{isLoading && <PageLoader />}
			{isError &&
				!layoutRestrictedRoutesList.includes(path) &&
				!isForgotPasswordRoute && (
					<div className='max-h-screen'>
						<NotFound />
					</div>
				)}
			{!layoutRestrictedRoutesList.includes(path) &&
				!isForgotPasswordRoute &&
				isSuccess && (
					<main className='flex h-screen max-h-screen bg-purple'>
						{sidebar && (
							<Sidebar
								userImage={user?.image}
								sidebarHandler={setSidebar}
								role={role}
								logout={handleLogout}
							/>
						)}
						<section className='flex flex-col items-center w-full max-h-screen h-full overflow-auto relative'>
							<header
								className={`flex h-20 px-3 ${
									sidebar
										? "w-10/12 end-0"
										: "w-full"
								} bg-slate-200 text-slate-900 fixed top-0 shadow-lg  z-30`}>
								<AdminNav
									userImage={user?.image}
									sidebar={sidebar}
									sidebarHandler={
										setSidebar
									}
									logout={handleLogout}
									role={role}
								/>
							</header>
							<div className='flex mt-20 h-full w-full '>
								{children}
							</div>
						</section>
					</main>
				)}

			{!isLoading && layoutRestrictedRoutesList.includes(path) && (
				<div className='max-h-screen'>{children}</div>
			)}
			{!isLoading && isForgotPasswordRoute && (
				<div className='max-h-screen'>{children}</div>
			)}
		</>
	);
};

export default UserLayout;
