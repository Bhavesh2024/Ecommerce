import { renderUserActivities } from "@/utils/helper/sidebar";
import { defaultImage } from "@/utils/helper/web-content";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
const Sidebar = ({ sidebarHandler, role, userImage, logout }) => {
	const path = usePathname();
	const userActivities = renderUserActivities(role);
	const isMobile = matchMedia("(max-width:768px)").matches;
	return (
		<>
			<aside className='fixed lg:static md:flex flex-col gap-2 bg-slate-200 h-screen w-60 z-40 lg:w-1/5 overflow-auto shadow'>
				<div className='w-full mx-auto h-40 bor flex  justify-center items-center flex-col relative'>
					<X
						className='absolute lg:hidden top-2 end-2 size-5 text-slate-800'
						onClick={() => sidebarHandler(false)}></X>
					<img
						src={userImage || defaultImage}
						className='h-24 w-24 object-fill rounded-full my-3'
					/>
					<Link
						href={"/user/admin/profile"}
						className='-mt-2 text-sm text-purple-500 hover:text-purple-700 text-start'>
						Edit Profile
					</Link>
				</div>
				<div className='flex relative h-full'>
					<ul className='flex flex-col gap-2 justify-start w-full'>
						{userActivities
							.filter(({ allowedRoles }) =>
								allowedRoles.includes(role),
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
											prefix + link
												? "bg-purple-50 !text-purple-700"
												: "hover:bg-purple-50 hover:text-purple-700"
										} w-full  text-slate-800 font-medium  h-9 flex items-center justify-center`}>
										<Link
											href={`${
												prefix +
												link
											}`}
											onClick={() =>
												isMobile
													? sidebarHandler(
															false,
													  )
													: ""
											}
											className='flex items-center gap-1  w-1/2 mx-auto '>
											{icon}
											{name}
										</Link>
									</li>
								),
							)}
					</ul>
					<div
						className='flex justify-center items-center bg-slate-900 bottom-0 absolute w-full z-30 start-0 md:w-full'
						onClick={logout}>
						<button className='h-12 w-1/2 mx-auto  text-white flex items-center gap-1'>
							<LogOut /> Logout
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
