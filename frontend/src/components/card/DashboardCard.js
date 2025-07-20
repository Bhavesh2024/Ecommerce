"use client";
import React from "react";

const DashboardCard = ({
	icon,
	title,
	value,
	isLoading = false,
	isPrice = false,
}) => {
	if (isLoading) {
		return (
			<div className='h-32 rounded-md border border-slate-300 bg-white w-full p-3 shadow animate-pulse'>
				<div className='flex items-center gap-2 text-slate-600'>
					<div className='w-5 h-5 bg-gray-200 rounded-full'></div>
					<div className='h-4 w-20 bg-gray-200 rounded'></div>
				</div>
				<div className='flex items-center h-4/5 justify-center'>
					<div className='h-8 w-24 bg-gray-200 rounded'></div>
				</div>
			</div>
		);
	}

	return (
		<div className='h-32 rounded-md border border-slate-300 bg-white w-full p-3 shadow'>
			<div className='flex items-center gap-2 text-slate-600'>
				{icon}
				<span className='text-slate-700 font-medium'>
					{title}
				</span>
			</div>
			<div
				className={`flex items-center h-4/5 ${
					isPrice ? "text-xl" : "text-3xl"
				} text-gray-600 font-semibold justify-center`}>
				{value}
			</div>
		</div>
	);
};

export default DashboardCard;
