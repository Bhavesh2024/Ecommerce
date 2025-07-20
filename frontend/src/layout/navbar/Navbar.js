"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Menu, X, User, SquareUser, Package, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import useCustomerStore, {
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import { defaultImage, defaultImageUrl } from "@/utils/helper/web-content";

const Navbar = () => {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const dropdownRef = useRef(0);
	const { user } = useCustomerStoreState();
	const router = useRouter();
	const { isSuccess, isLoading, data } = useAuth("login", "", true);
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
			classes: "text-slate-700 hover:bg-purple-200 rounded-t-md",
			icon: <SquareUser className='size-5 text-purple-500' />,
		},

		{
			link: "/my-orders",
			title: "My Orders",
			classes: "text-slate-700 hover:bg-purple-200",
			icon: <Package className='size-5 text-purple-500' />,
		},
	];

	const handleLogout = async () => {
		try {
			mutate({ method: "post", type: "logout" });
		} catch (err) {
			console.log("Error:-", err.message);
		}
	};

	const handleUserDropdown = (e) => {
		e.stopPropagation();
		setUserMenuOpen(!userMenuOpen);
		setMenuOpen(false);
	};

	const handlePageMenu = () => {
		setMenuOpen(!menuOpen);
		setUserMenuOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setUserMenuOpen(false); // Close dropdown
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div
			className='bg-slate-200 text-neutral-800 shadow-lg z-50'
			onClick={() => setUserMenuOpen(false)}>
			<div className='flex items-center justify-between px-4  md:px-8 h-20'>
				{/* Logo */}
				<div
					className='h-full flex items-center justify-center'
					onClick={() => router.push("/")}>
					<h1 className='text-2xl md:text-3xl font-semibold font-logo'>
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
											? "text-purple-700"
											: ""
									} hover:text-purple-600`}>
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
											className='px-4 py-2 bg-purple-700 rounded text-white hover:bg-purple-500'>
											Sign Up
										</Link>
										<Link
											href='/user/customer/auth/login'
											className='px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-500'>
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
						<div className='relative flex items-center'>
							<button
								onClick={handleUserDropdown}
								className={` text-black rounded-full ${
									user && user.image
										? ""
										: "p-1"
								}`}>
								{user && user.image ? (
									<img
										src={user.image}
										className='size-10 rounded-full object-fill'
									/>
								) : (
									<img
										src={
											defaultImageUrl
										}
										className='size-8 rounded-full object-fill'
									/>
								)}
							</button>
							{userMenuOpen && (
								<div
									className='absolute right-0 top-full mt-2 md:w-40 text-nowrap min-w-28 bg-white text-black rounded shadow z-20'
									ref={dropdownRef}>
									{isSuccess ? (
										<div className='flex flex-col gap-1 text-start'>
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
												className='text-start text-slate-700 hover:bg-purple-200 h-7 flex items-center gap-1 px-3'
												onClick={
													handleLogout
												}>
												<LogOut className='size-5 text-purple-500' />{" "}
												Logout
											</button>
										</div>
									) : (
										<>
											<Link
												href='/user/customer/auth/signup'
												className='block font-semibold px-4 py-2 hover:bg-purple-100'>
												Sign Up
											</Link>
											<Link
												href='/user/customer/auth/login'
												className='block font-semibold px-4 py-2 hover:bg-purple-100'>
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
						onClick={handlePageMenu}
						className='text-neutral-800 focus:outline-none md:hidden'>
						{menuOpen ? (
							<X size={25} />
						) : (
							<Menu size={25} />
						)}
					</button>
				</div>
			</div>

			{/* Mobile Sidebar */}
			{menuOpen && (
				<div className='md:hidden bg-slate-200  px-6 py-4 space-y-4 border-t border-slate-300 shadow-lg'>
					{pagesList.map(({ link, name }) => (
						<Link
							key={link}
							href={link}
							className={`block ${
								link === pathname
									? "text-indigo-900"
									: ""
							} hover:text-indigo-500`}
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
