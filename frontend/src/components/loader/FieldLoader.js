import React from "react";
export const VariantFieldLoader = () => {
	return (
		<div className='border border-slate-200 p-3 rounded shadow-sm flex justify-between items-center animate-pulse'>
			{/* Left side - label and price */}
			<div className='space-y-2'>
				<div className='h-4 w-24 bg-gray-200 rounded'></div>
				<div className='h-3 w-12 bg-gray-200 rounded'></div>
			</div>

			{/* Right side - quantity controls */}
			<div className='flex items-center space-x-2'>
				<div className='h-6 w-6 bg-gray-200 rounded'></div>
				<div className='h-4 w-4 bg-gray-200 rounded'></div>
				<div className='h-6 w-6 bg-gray-200 rounded'></div>
			</div>
		</div>
	);
};
