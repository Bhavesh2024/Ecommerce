"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const router = useRouter();
	const pagesList = [
		{ link: "/", name: "Home" },
		{ link: "/contact", name: "Contact" },
		{ link: "/term-condition", name: "Term & Condition" },
	];

	return (
		<div className="bg-neutral-900 text-white">
			<div className="flex items-center justify-between px-4  md:px-8 h-20">
				{/* Logo */}
				<div
					className="h-full flex items-center justify-center"
					onClick={() => router.push("/")}
				>
					{/* <img
						src="/images/logo/logo.png"
						alt="Logo"
						className="h-full w-full object-contain"
					/> */}
					<h1 className="text-2xl md:text-3xl font-semibold   text-sky-300 font-serif">
						Upsquare
					</h1>
				</div>

				{/* Desktop Nav */}
				<div className="hidden md:flex items-center gap-6 font-semibold">
					<ul className="flex items-center gap-4">
						{pagesList.map(({ link, name }) => (
							<li key={link}>
								<Link
									href={link}
									className={`${
										link === pathname ? "text-sky-400" : ""
									} hover:text-yellow-300`}
								>
									{name}
								</Link>
							</li>
						))}
					</ul>

					<Link
						href="/user/customer/auth/signup"
						className="px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-300"
					>
						Sign Up
					</Link>
					<Link
						href="/user/customer/auth/login"
						className="px-4 py-2 bg-sky-600 rounded hover:bg-sky-500"
					>
						Login
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className="flex md:hidden items-center gap-3">
					{/* User Icon Dropdown */}
					<div className="relative">
						<button
							onClick={() => setUserMenuOpen(!userMenuOpen)}
							className="p-2 bg-white text-black rounded-full"
						>
							<User size={20} />
						</button>
						{userMenuOpen && (
							<div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow z-20">
								<Link
									href="/user/customer/auth/signup"
									className="block px-4 py-2 hover:bg-gray-100"
								>
									Sign Up
								</Link>
								<Link
									href="/user/customer/auth/login"
									className="block px-4 py-2 hover:bg-gray-100"
								>
									Login
								</Link>
							</div>
						)}
					</div>

					{/* Hamburger Button */}
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="text-white focus:outline-none"
					>
						{menuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>
			</div>

			{/* Mobile Sidebar */}
			{menuOpen && (
				<div className="md:hidden bg-neutral-800 text-white px-6 py-4 space-y-4">
					{pagesList.map(({ link, name }) => (
						<Link
							key={link}
							href={link}
							className={`block ${
								link === pathname ? "text-sky-400" : ""
							} hover:text-yellow-300`}
							onClick={() => setMenuOpen(false)}
						>
							{name}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Navbar;
