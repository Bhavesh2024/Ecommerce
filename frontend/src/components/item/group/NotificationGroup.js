import React from "react";
import dynamic from "next/dynamic";
import { NotificationItemLoader } from "@/components/loader/ItemLoader";
const NotificationItem = dynamic(() => import("../NotificationItem"), {
	ssr: true,
	loading: () => <NotificationItemLoader />,
});
import { useRouter } from "next/navigation";

const NotificationGroup = ({
	groupName,
	notifications,
	onDelete,
	isExpanded,
	onToggle,
}) => {
	return (
		<div className='mb-6'>
			<div
				className='flex justify-between items-center mb-3 cursor-pointer'
				onClick={onToggle}>
				<h2 className='text-lg font-semibold text-slate-800'>
					{groupName}
				</h2>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full'>
						{notifications.length}
					</span>
					<svg
						className={`w-4 h-4 text-slate-500 transition-transform ${
							isExpanded ? "rotate-180" : ""
						}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</div>
			</div>

			{isExpanded && (
				<ul className='space-y-3'>
					{notifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onDelete={onDelete}
							router={useRouter()}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default NotificationGroup;
