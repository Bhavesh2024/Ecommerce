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
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";

const UserLayout = ({ children }) => {
	const [sidebar, setSidebar] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const router = useRouter();
	const path = usePathname();
	const { role } = useParams();

	const layoutRestrictedRoutesList = [
		`/user/${role}/auth/signup`,
		`/user/${role}/auth/login`,
	];
	const isProtected = useMemo(() => {
		return !layoutRestrictedRoutesList.includes(path);
	}, [path]);
	const { user } = useAdminStoreState();
	const { setValue } = useAdminStoreActions();
	const { data, isLoading, isSuccess, isError } = useAuth(isProtected);
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

	const adminActivities = [
		{
			link: `/user/${role}/profile`,
			title: "My Profile",
			classes: "text-slate-500 hover:bg-blue-100 ",
			icon: <SquareUser className='size-5 text-blue-500' />,
		},
	];

	const userActivities = [
		{
			icon: <LayoutDashboard />,
			name: "Dashboard",
			prefix: `/user/${role}/`,
			link: "dashboard",
			allowedRoles: ["admin"],
		},

		{
			icon: <User />,
			name: "User",
			prefix: `/user/${role}/`,
			link: "users",
			allowedRoles: ["admin"],
		},
		{
			icon: <Package />,
			name: "Product",
			prefix: `/user/${role}/`,
			link: "products",
			allowedRoles: ["admin"],
		},
		{
			icon: <Truck />,
			name: "Order",
			prefix: `/user/${role}/`,
			link: "orders",
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

	useEffect(() => {
		if (isSuccess && data) {
			const { user } = data;
			setValue("user", user);
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
			{isError && !layoutRestrictedRoutesList.includes(path) && (
				<div className='max-h-screen'>
					<NotFound />
				</div>
			)}
			{!layoutRestrictedRoutesList.includes(path) && isSuccess && (
				<main className='flex h-screen max-h-screen'>
					{!layoutRestrictedRoutesList.includes(path) &&
						sidebar && (
							<aside className=' fixed md:static md:flex flex-col gap-2 bg-neutral-900 h-screen w-3/5 z-30 md:w-1/5'>
								<div className='w-full mx-auto h-40 bor flex  justify-center items-center flex-col relative'>
									<X
										className='absolute md:hidden top-2 end-2 size-5 text-white'
										onClick={() =>
											setSidebar(
												false,
											)
										}></X>
									<img
										src={
											user?.image ||
											"/images/default/profile.svg"
										}
										className='h-24 w-24 object-fill rounded-full my-3'
									/>
									<Link
										href={
											"/user/admin/profile"
										}
										className='-mt-2 text-sm text-blue-500 text-start'>
										Edit Profile
									</Link>
								</div>
								<div className='flex'>
									<ul className='flex flex-col gap-2 justify-center w-full'>
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
													<li className='w-full hover:bg-gray-100 text-white hover:text-neutral-600 h-9 flex items-center justify-center'>
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
								</div>
							</aside>
						)}
					<section className='flex flex-col items-center w-full max-h-screen h-full overflow-auto relative'>
						<header
							className={`flex h-20 px-3 ${
								sidebar
									? "w-10/12 end-0"
									: "w-full"
							} bg-neutral-900 text-sky-100 fixed top-0  `}>
							<nav
								className={`flex items-center justify-between w-full `}>
								<div className=''>
									<Menu
										onClick={() =>
											setSidebar(
												!sidebar,
											)
										}
									/>
									{openDropdown && (
										<div className='absolute right-0 mt-2 w-32 bg-white text-black rounded shadow z-20'>
											<div className='flex flex-col gap-1 text-start py-1'>
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
													className='text-start text-slate-500 hover:bg-red-100 h-7 flex items-center gap-1 px-3'
													onClick={
														handleLogout
													}>
													<LogOut className='size-5 text-red-500' />{" "}
													Logout
												</button>
											</div>
										</div>
									)}
								</div>

								<div className='flex items-center gap-1'>
									{/* <Bell /> */}
									<img
										onClick={() =>
											setOpenDropdown(
												!openDropdown,
											)
										}
										src={
											user?.image ||
											"/images/default/profile.svg"
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

			{layoutRestrictedRoutesList.includes(path) && (
				<div className='max-h-screen'>{children}</div>
			)}
		</>
	);
};

export default UserLayout;
