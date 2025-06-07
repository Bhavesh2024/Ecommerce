"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X, User, SquareUser, Package, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import useCustomerStore, {
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";

const Navbar = () => {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const { user } = useCustomerStoreState();
	const router = useRouter();
	const { isSuccess, isLoading, data } = useAuth(true);
	const { mutate } = useMutation({
		mutationFn: handleAuth,
		onSuccess: (data) => {
			router.push("/user/customer/auth/login");
		},
		onError: (err) => {
			console.log(err);
		},
	});
	const pagesList = [
		{ link: "/", name: "Home" },
		{ link: "/contact", name: "Contact" },
		{ link: "/term-condition", name: "Term & Condition" },
	];

	const customerActivities = [
		{
			link: "/profile",
			title: "My Profile",
			classes: "text-slate-500 hover:bg-blue-100 ",
			icon: <SquareUser className='size-5 text-blue-500' />,
		},

		{
			link: "/my-orders",
			title: "My Orders",
			classes: "text-slate-500 hover:bg-yellow-100",
			icon: <Package className='size-5 text-yellow-500' />,
		},
	];

	const handleLogout = async () => {
		try {
			mutate({ method: "post", type: "logout" });
		} catch (err) {
			console.log("Error:-", err.message);
		}
	};

	return (
		<div className='bg-neutral-900 text-white z-20'>
			<div className='flex items-center justify-between px-4  md:px-8 h-20'>
				{/* Logo */}
				<div
					className='h-full flex items-center justify-center'
					onClick={() => router.push("/")}>
					{/* <img
						src="/images/logo/logo.png"
						alt="Logo"
						className="h-full w-full object-contain"
					/> */}
					<h1 className='text-2xl md:text-3xl font-semibold   text-sky-300 font-serif'>
						Upsquare
					</h1>
				</div>

				{/* Desktop Nav */}
				<div className='flex items-center gap-1 md:gap-6 font-semibold'>
					<ul className='hidden md:flex items-center gap-4'>
						{pagesList.map(({ link, name }) => (
							<li key={link}>
								<Link
									href={link}
									className={`${
										link === pathname
											? "text-sky-400"
											: ""
									} hover:text-yellow-300`}>
									{name}
								</Link>
							</li>
						))}
						{!isLoading && (
							<>
								{!isSuccess && (
									<>
										<Link
											href='/user/customer/auth/signup'
											className='px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-300'>
											Sign Up
										</Link>
										<Link
											href='/user/customer/auth/login'
											className='px-4 py-2 bg-sky-600 rounded hover:bg-sky-500'>
											Login
										</Link>
									</>
								)}
							</>
						)}
					</ul>

					{/* Mobile Menu Button */}
					<div
						className={`flex ${
							!isSuccess ? "md:hidden" : ""
						} items-center gap-3`}>
						{/* User Icon Dropdown */}
						<div className='relative'>
							<button
								onClick={() =>
									setUserMenuOpen(
										!userMenuOpen,
									)
								}
								className=' bg-white text-black rounded-full'>
								{user && user.image ? (
									<img
										src={user.image}
										className='size-10 rounded-full object-fill'
									/>
								) : (
									<User size={20} />
								)}
							</button>
							{userMenuOpen && (
								<div className='absolute right-0 mt-2 w-32 bg-white text-black rounded shadow z-20'>
									{isSuccess ? (
										<div className='flex flex-col gap-1 text-start py-1'>
											{customerActivities.map(
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
									) : (
										<>
											<Link
												href='/user/customer/auth/signup'
												className='block px-4 py-2 hover:bg-gray-100'>
												Sign Up
											</Link>
											<Link
												href='/user/customer/auth/login'
												className='block px-4 py-2 hover:bg-gray-100'>
												Login
											</Link>
										</>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Hamburger Button */}
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className='text-white focus:outline-none md:hidden'>
						{menuOpen ? (
							<X size={28} />
						) : (
							<Menu size={28} />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Sidebar */}
			{menuOpen && (
				<div className='md:hidden bg-neutral-800 text-white px-6 py-4 space-y-4'>
					{pagesList.map(({ link, name }) => (
						<Link
							key={link}
							href={link}
							className={`block ${
								link === pathname
									? "text-sky-400"
									: ""
							} hover:text-yellow-300`}
							onClick={() => setMenuOpen(false)}>
							{name}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Navbar;
