import React from "react";
import { motion } from "framer-motion";
import { User as UserIcon } from "lucide-react";

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

export const NotificationItemLoader = () => {
	return (
		<li className='border border-slate-200 rounded-lg p-4 shadow-sm bg-white animate-pulse'>
			<div className='flex items-center gap-3'>
				{/* Avatar Skeleton */}
				<div className='flex-shrink-0'>
					<div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center'>
						<UserIcon className='w-5 h-5 text-slate-300' />
					</div>
				</div>

				{/* Content Skeleton */}
				<div className='flex-1 w-full'>
					<div className='flex justify-between items-start'>
						<div className='w-full'>
							{/* Name Skeleton */}
							<div className='h-4 bg-slate-200 rounded w-3/4 mb-2'></div>

							{/* Message Skeleton */}
							<div className='h-3 bg-slate-200 rounded w-full mt-2'></div>
							<div className='h-3 bg-slate-200 rounded w-5/6 mt-1'></div>

							{/* Timestamp Skeleton */}
							<div className='flex gap-2 mt-3'>
								<div className='h-2 bg-slate-200 rounded w-12'></div>
								<div className='h-2 bg-slate-200 rounded w-16'></div>
							</div>
						</div>

						{/* Actions Skeleton */}
						<div className='relative flex items-center my-auto'>
							<div className='w-5 h-5 bg-slate-200 rounded'></div>
						</div>
					</div>
				</div>
			</div>
		</li>
	);
};

export const NotificationGroupLoader = ({ count = 3 }) => {
	return (
		<div className='mb-6 animate-pulse'>
			{/* Group header skeleton */}
			<div className='flex justify-between items-center mb-3'>
				<div className='h-6 bg-slate-200 rounded w-1/4'></div>
				<div className='flex items-center gap-2'>
					<div className='h-5 w-5 bg-slate-200 rounded-full'></div>
					<div className='w-4 h-4 bg-slate-200 rounded'></div>
				</div>
			</div>

			{/* Notification items skeleton */}
			<ul className='space-y-3'>
				{Array.from({ length: count }).map((_, index) => (
					<NotificationItemLoader key={index} />
				))}
			</ul>
		</div>
	);
};
