import React from "react";
import { motion } from "framer-motion";
export const NoItemLoader = () => {
	return (
		<div className='flex h-full w-full items-center justify-center flex-col gap-4 animate-pulse'>
			{/* Icon Skeleton - Circle with X */}
			<div className='size-24 bg-gray-200 rounded-full flex items-center justify-center'>
				<div className='w-16 h-1 bg-gray-300 rotate-45 absolute'></div>
				<div className='w-16 h-1 bg-gray-300 -rotate-45 absolute'></div>
			</div>

			{/* Message Skeleton */}
			<div className='h-8 w-48 bg-gray-200 rounded'></div>
		</div>
	);
};

export const ProductAddonLoader = () => {
	return (
		<motion.div className='flex justify-between items-center p-4 border border-gray-200 rounded-lg animate-pulse'>
			<div className='w-3/4'>
				<div className='h-5 bg-gray-200 rounded w-2/3'></div>
			</div>
			<div className='h-5 bg-gray-200 rounded w-10'></div>
		</motion.div>
	);
};
