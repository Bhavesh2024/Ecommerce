"use client";
import { defaultImage } from "@/utils/helper/web-content";
import { Bell, LogOut, Menu, SquareUser } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const AdminNav = ({ sidebarHandler, sidebar, userImage, role, logout }) => {
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef = useRef(null);
	const adminActivities = [
		{
			link: `/user/${role}/profile`,
			title: "My Profile",
			classes: "text-slate-800 hover:bg-purple-100 rounded-t",
			icon: <SquareUser className='size-5 text-purple-500' />,
		},
	];

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setOpenDropdown(false); // Close dropdown
				// setToggleNotification(false); // Close dropdown
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	return (
		<>
			<nav className={`flex items-center justify-between w-full  `}>
				<div className=''>
					<Menu
						onClick={() => sidebarHandler(!sidebar)}
						className='hover:text-slate-700'
					/>
					{openDropdown && (
						<div
							className='absolute right-2 top-16 w-32 bg-white text-black rounded shadow z-20'
							ref={dropdownRef}>
							<div className='flex flex-col gap-1 text-start '>
								{adminActivities.map(
									({
										link,
										title,
										icon,
										classes,
									}) => (
										<Link
											href={link}
											className={`${classes} w-full  flex items-center gap-1 px-3 h-7`}>
											{icon}
											{title}
										</Link>
									),
								)}
								<button
									className='text-start text-slate-800 hover:bg-purple-100 rounded-b-md h-7 flex items-center gap-1 px-3'
									onClick={logout}>
									<LogOut className='size-5 text-purple-500' />{" "}
									Logout
								</button>
							</div>
						</div>
					)}
				</div>

				<div className='flex items-center gap-3'>
					<div className='hover:text-slate-900 rounded-full p-1 relative'>
						<Link href={`/user/${role}/notifications`}>
							<Bell className='hover:text-slate-700 size-6' />
						</Link>
						{/* {toggleNotification && (
							<>
								<div
									className='bg-white w-[300px] min-h-40 rounded-md absolute top-9 end-0 flex flex-col justify-between p-3'
									ref={dropdownRef}>
									<div></div>
									<button className='bg-purple-700 w-24 mx-auto text-nowrap hover:bg-purple-500 p-2 rounded text-sm text-white'>
										Show More
									</button>
								</div>
							</>
						)} */}
					</div>
					<img
						onClick={() =>
							setOpenDropdown(!openDropdown)
						}
						src={userImage || defaultImage}
						className='h-10 w-10 object-fill rounded-full'
					/>
				</div>
			</nav>
		</>
	);
};

export default AdminNav;
