"use client";
import React from "react";

const DashboardCard = ({ icon: Icon, label, value }) => {
	return (
		<div className='h-32 rounded-md border border-slate-300 bg-white w-full p-3 shadow'>
			<div className='flex items-center gap-2 text-sm text-slate-600'>
				<Icon className='text-purple-500 size-5' />
				<span className='text-gray-600 font-medium'>
					{label}
				</span>
			</div>
			<div className='flex items-center h-4/5 text-xl md:text-xl text-gray-600 font-semibold justify-center'>
				{value}
			</div>
		</div>
	);
};

export default DashboardCard;
