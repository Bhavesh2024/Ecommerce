"use client";
import React from "react";

export const HelpSectionLoader = () => {
	return (
		<div className='max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100 animate-pulse'>
			<div className='text-center space-y-4'>
				<div className='h-8 bg-gray-200 rounded w-3/4 mx-auto'></div>
				<div className='h-4 bg-gray-200 rounded w-5/6 mx-auto'></div>
				<div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
				<div className='h-12 bg-gray-200 rounded-lg w-40 mx-auto'></div>
			</div>
			<div className='mt-8 space-y-4'>
				<div className='h-4 bg-gray-200 rounded w-full'></div>
				<div className='h-4 bg-gray-200 rounded w-5/6'></div>
				<div className='grid grid-cols-2 gap-4 mt-6'>
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className='h-12 bg-gray-200 rounded-lg'></div>
					))}
				</div>
			</div>
		</div>
	);
};

export const TermNavigationLoader = () => {
	return (
		<div className='max-w-4xl mx-auto mb-8 hidden md:block'>
			<div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse'>
				<div className='h-6 bg-gray-200 rounded w-40 mb-4'></div>
				<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className='flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100'>
							<div className='w-5 h-5 bg-gray-200 rounded-full'></div>
							<div className='h-4 bg-gray-200 rounded w-24'></div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export const TermSectionLoader = () => {
	return (
		<div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse'>
			<div className='w-full flex justify-between items-center p-6'>
				<div className='flex items-center gap-4'>
					<div className='p-2 bg-gray-200 rounded-lg w-9 h-9'></div>
					<div className='space-y-2'>
						<div className='h-6 bg-gray-200 rounded w-40'></div>
						<div className='h-4 bg-gray-200 rounded w-56'></div>
					</div>
				</div>
				<div className='w-5 h-5 bg-gray-200 rounded-full'></div>
			</div>

			<div className='px-6 pb-6 pt-2 border-t border-gray-100 space-y-3'>
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className='flex items-start gap-3'>
						<div className='h-4 bg-gray-200 rounded flex-1'></div>
					</div>
				))}
				<div className='mt-4 space-y-2 pl-5'>
					<div className='h-4 bg-gray-200 rounded w-32'></div>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className='h-3 bg-gray-200 rounded w-full'></div>
					))}
				</div>
			</div>
		</div>
	);
};
