"use client";

import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import { handleAuth } from "@/utils/api/authApi";
import { useMutation } from "@tanstack/react-query";
import {
	Menu,
	Bell,
	LayoutDashboard,
	Package,
	NotebookPen,
	User,
	Truck,
	X,
	SquareUser,
	LogOut,
	WalletCards,
	RotateCcw,
	CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { initFCM } from "@/hooks/notification/usePushNotification";
import { handleNotification } from "@/utils/api/notificationApi";
import { defaultImage } from "@/utils/helper/web-content";

const UserLayout = ({ children }) => {
	const [sidebar, setSidebar] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef = useRef(0);
	const notificationRef = useRef(0);
	const router = useRouter();
	const path = usePathname();
	const { role } = useParams();
	const [toggleNotification, setToggleNotification] = useState(false);
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
	const { mutate: notificationMutation } = useMutation({
		mutationFn: handleNotification,
		onSuccess: (data) => {
			console.log("Notification Enabled");
		},
		onError: (error) => {
			console.log("Error", error.message);
		},
	});
	const adminActivities = [
		{
			link: `/user/${role}/profile`,
			title: "My Profile",
			classes: "text-slate-800 hover:bg-purple-100 rounded-t",
			icon: <SquareUser className='size-5 text-purple-500' />,
		},
	];

	const userActivities = [
		{
			icon: <LayoutDashboard className='text-purple-700' />,
			name: "Dashboard",
			prefix: `/user/${role}/`,
			link: "dashboard",
			allowedRoles: ["admin"],
		},

		{
			icon: <User className='text-purple-700' />,
			name: "User",
			prefix: `/user/${role}/`,
			link: "users",
			allowedRoles: ["admin"],
		},
		{
			icon: <Package className='text-purple-700' />,
			name: "Product",
			prefix: `/user/${role}/`,
			link: "products",
			allowedRoles: ["admin"],
		},
		{
			icon: <Truck className='text-purple-700' />,
			name: "Order",
			prefix: `/user/${role}/`,
			link: "orders",
			allowedRoles: ["admin"],
		},
		{
			icon: <Bell className='text-purple-700' />,
			name: "Notifications",
			prefix: `/user/${role}/`,
			link: "notifications",
			allowedRoles: ["admin"],
		},
		{
			icon: <WalletCards className='text-purple-700' />,
			name: "Payment",
			prefix: `/user/${role}/`,
			link: "payments",
			allowedRoles: ["admin"],
		},
		{
			icon: <CreditCard className='text-purple-700' />,
			name: "Refund",
			prefix: `/user/${role}/`,
			link: "refunds",
			allowedRoles: ["admin"],
		},
		// {
		// 	icon: <NotebookPen />,
		// 	name: "Inventory",
		// 	prefix: `/user/${role}/`,
		// 	link: "inventory",
		// 	allowedRoles: ["admin"],
		// },
	];

	/* Handler Method */
	const handleLogout = () => {
		logoutMutation({ method: "post", type: "logout" });
	};

	useEffect(() => {
		if (isLogoutSuccess) {
			setSidebar(false);
			setOpenDropdown(false);
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
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setOpenDropdown(false); // Close dropdown
				setToggleNotification(false); // Close dropdown
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
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
							<aside className='fixed lg:static md:flex flex-col gap-2 bg-slate-200 h-screen w-60 z-40 lg:w-1/5 overflow-auto shadow'>
								<div className='w-full mx-auto h-40 bor flex  justify-center items-center flex-col relative'>
									<X
										className='absolute lg:hidden top-2 end-2 size-5 text-slate-800'
										onClick={() =>
											setSidebar(
												false,
											)
										}></X>
									<img
										src={
											user?.image ||
											defaultImage
										}
										className='h-24 w-24 object-fill rounded-full my-3'
									/>
									<Link
										href={
											"/user/admin/profile"
										}
										className='-mt-2 text-sm text-purple-500 hover:text-purple-700 text-start'>
										Edit Profile
									</Link>
								</div>
								<div className='flex relative h-full'>
									<ul className='flex flex-col gap-2 justify-start w-full'>
										{userActivities
											.filter(
												({
													allowedRoles,
												}) =>
													allowedRoles.includes(
														role,
													),
											)
											.map(
												({
													link,
													icon,
													prefix,
													name,
												}) => (
													<li
														className={`${
															path ==
															prefix +
																link
																? "bg-purple-50 !text-purple-700"
																: "hover:bg-purple-50 hover:text-purple-700"
														} w-full  text-slate-800 font-medium  h-9 flex items-center justify-center`}>
														<Link
															href={`${
																prefix +
																link
															}`}
															className='flex items-center gap-1  w-1/2 mx-auto '>
															{
																icon
															}
															{
																name
															}
														</Link>
													</li>
												),
											)}
									</ul>
									<div
										className='flex justify-center items-center bg-slate-900 bottom-0 absolute w-full z-30 start-0 md:w-full'
										onClick={
											handleLogout
										}>
										<button className='h-12 w-1/2 mx-auto  text-white flex items-center gap-1'>
											<LogOut />{" "}
											Logout
										</button>
									</div>
								</div>
							</aside>
						)}
						<section className='flex flex-col items-center w-full max-h-screen h-full overflow-auto relative'>
							<header
								className={`flex h-20 px-3 ${
									sidebar
										? "w-10/12 end-0"
										: "w-full"
								} bg-slate-200 text-slate-900 fixed top-0 shadow-lg  z-30`}>
								<nav
									className={`flex items-center justify-between w-full  `}>
									<div className=''>
										<Menu
											onClick={() =>
												setSidebar(
													!sidebar,
												)
											}
											className='hover:text-slate-700'
										/>
										{openDropdown && (
											<div
												className='absolute right-2 top-16 w-32 bg-white text-black rounded shadow z-20'
												ref={
													dropdownRef
												}>
												<div className='flex flex-col gap-1 text-start '>
													{adminActivities.map(
														({
															link,
															title,
															icon,
															classes,
														}) => (
															<Link
																href={
																	link
																}
																className={`${classes} w-full  flex items-center gap-1 px-3 h-7`}>
																{
																	icon
																}
																{
																	title
																}
															</Link>
														),
													)}
													<button
														className='text-start text-slate-800 hover:bg-purple-100 rounded-b-md h-7 flex items-center gap-1 px-3'
														onClick={
															handleLogout
														}>
														<LogOut className='size-5 text-purple-500' />{" "}
														Logout
													</button>
												</div>
											</div>
										)}
									</div>

									<div className='flex items-center gap-3'>
										<div className='hover:text-slate-900 rounded-full p-1 relative'>
											<Bell
												className='hover:text-slate-700 size-6'
												onClick={() =>
													router.push(
														`/user/${role}/notifications`,
													)
												}
											/>
											{toggleNotification && (
												<>
													<div
														className='bg-white w-[300px] min-h-40 rounded-md absolute top-9 end-0 flex flex-col justify-between p-3'
														ref={
															dropdownRef
														}>
														<div></div>
														<button className='bg-purple-700 w-24 mx-auto text-nowrap hover:bg-purple-500 p-2 rounded text-sm text-white'>
															Show
															More
														</button>
													</div>
												</>
											)}
										</div>
										<img
											onClick={() =>
												setOpenDropdown(
													!openDropdown,
												)
											}
											src={
												user?.image ||
												defaultImage
											}
											className='h-10 w-10 object-fill rounded-full'
										/>
									</div>
								</nav>
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
