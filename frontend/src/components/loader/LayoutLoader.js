"use client";
import React from "react";

export const FooterLoader = () => {
	return (
		<footer className='bg-slate-200 text-neutral-700 mt-8 shadow animate-pulse'>
			<div className='max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8'>
				{/* Logo Section Skeleton */}
				<div>
					<div className='h-8 w-32 bg-gray-300 rounded mb-3'></div>
					<div className='h-4 bg-gray-300 rounded w-full'></div>
					<div className='h-4 bg-gray-300 rounded w-3/4 mt-2'></div>
				</div>

				{/* Quick Links Skeleton */}
				<div>
					<div className='h-6 w-24 bg-gray-300 rounded mb-3'></div>
					<ul className='space-y-2'>
						{[1, 2, 3].map((item) => (
							<li key={item}>
								<div className='h-4 bg-gray-300 rounded w-3/4'></div>
							</li>
						))}
					</ul>
				</div>

				{/* Contact Info Skeleton */}
				<div>
					<div className='h-6 w-24 bg-gray-300 rounded mb-3'></div>
					<ul className='space-y-3'>
						{[1, 2, 3].map((item) => (
							<li
								key={item}
								className='flex items-center gap-2'>
								<div className='h-5 w-5 bg-gray-300 rounded-full'></div>
								<div className='h-4 bg-gray-300 rounded w-3/4'></div>
							</li>
						))}
					</ul>
				</div>

				{/* Social Media Skeleton */}
				<div>
					<div className='h-6 w-24 bg-gray-300 rounded mb-3'></div>
					<ul className='space-y-3'>
						{[1, 2, 3].map((item) => (
							<li
								key={item}
								className='flex items-center gap-2'>
								<div className='h-5 w-5 bg-gray-300 rounded-full'></div>
								<div className='h-4 bg-gray-300 rounded w-3/4'></div>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Bottom Copyright Skeleton */}
			<div className='border-t border-gray-300 text-center py-4'>
				<div className='h-4 bg-gray-300 rounded w-1/2 mx-auto'></div>
			</div>
		</footer>
	);
};
