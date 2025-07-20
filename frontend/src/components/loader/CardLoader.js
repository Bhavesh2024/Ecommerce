"use client";
import React from "react";

export const CollectionCardLoader = () => {
	return (
		<div className='bg-white p-6 rounded-lg border border-gray-200'>
			<div className='flex items-center mb-3'>
				<div className='w-6 h-6 bg-gray-200 rounded-full mr-3 animate-pulse' />
				<div className='h-6 bg-gray-200 rounded w-3/4 animate-pulse'></div>
			</div>
			<div className='space-y-2'>
				<div className='h-4 bg-gray-200 rounded w-full animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded w-5/6 animate-pulse'></div>
			</div>
		</div>
	);
};

export const ProductCardLoader = () => {
	return (
		<div className='relative bg-white rounded-2xl overflow-hidden shadow-xl border-0'>
			{/* Floating price tag skeleton */}
			<div className='absolute top-4 right-4 z-10 bg-gray-200 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md animate-pulse'>
				<span className='font-bold text-transparent text-sm'>
					$00.00
				</span>
			</div>

			{/* Image skeleton */}
			<div className='relative aspect-[4/3] overflow-hidden bg-gray-200 animate-pulse'></div>

			{/* Content skeleton */}
			<div className='p-5 bg-gray-50'>
				<div className='h-6 bg-gray-200 rounded-full w-3/4 mb-3 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-full w-full mb-1 animate-pulse'></div>
				<div className='h-4 bg-gray-200 rounded-full w-2/3 animate-pulse'></div>

				{/* Buttons skeleton */}
				<div className='flex gap-3 mt-4'>
					<div className='flex-1 h-12 bg-gray-200 rounded-xl animate-pulse'></div>
					<div className='w-12 h-12 bg-gray-200 rounded-xl animate-pulse'></div>
				</div>
			</div>
		</div>
	);
};

export const InfoCardLoader = () => (
	<div className='bg-white p-6 rounded-lg animate-pulse'>
		{/* Icon placeholder */}
		<div className='w-8 h-8 bg-gray-200 rounded-full mx-auto mb-3'></div>

		{/* Title placeholder */}
		<div className='h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2'></div>

		{/* Content placeholders */}
		<div className='space-y-1'>
			<div className='h-3 bg-gray-200 rounded w-full'></div>
			<div className='h-3 bg-gray-200 rounded w-5/6 mx-auto'></div>
			<div className='h-3 bg-gray-200 rounded w-2/3 mx-auto'></div>
		</div>
	</div>
);

export const OrderCardLoader = () => {
	return (
		<div className='w-full bg-purple-50 border border-purple-300 rounded-xl flex gap-4 relative overflow-hidden'>
			{/* Image Skeleton */}
			<div className='w-28 lg:w-32 h-40 flex-shrink-0 bg-gray-200 animate-pulse rounded-l-xl'></div>

			{/* Details Skeleton */}
			<div className='flex flex-col justify-between flex-grow p-4'>
				<div className='flex flex-col gap-3'>
					{/* Product Name Skeleton */}
					<div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse'></div>

					{/* Order Date Skeleton */}
					<div className='h-3 w-1/2 bg-gray-200 rounded animate-pulse'></div>

					{/* Price Skeleton */}
					<div className='h-3 w-1/3 bg-gray-200 rounded animate-pulse'></div>
				</div>

				{/* Status Skeleton */}
				<div className='flex gap-2 items-center mt-2'>
					<div className='h-6 w-16 bg-gray-200 rounded-full animate-pulse'></div>
					<div className='h-6 w-16 bg-gray-200 rounded-full animate-pulse'></div>
				</div>
			</div>
		</div>
	);
};

export const OrderSummaryLoader = () => {
	return (
		<div className='w-full max-w-2xl mx-auto bg-white shadow-sm rounded-2xl p-6 relative space-y-6 border border-purple-200 animate-pulse'>
			{/* Header Skeleton */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200 pb-3'>
				<div className='h-6 w-3/4 bg-gray-200 rounded'></div>
				<div className='h-4 w-1/4 bg-gray-200 rounded'></div>
			</div>

			{/* Cancel Order Skeleton */}
			<div className='mt-4 flex items-center justify-between border border-purple-200 bg-purple-50 rounded-lg px-2 gap-2 py-3'>
				<div className='h-4 w-2/3 bg-gray-200 rounded'></div>
				<div className='h-8 w-8 bg-gray-200 rounded-full'></div>
			</div>

			{/* Order Info and Status Skeleton */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-3'>
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className='flex justify-between'>
							<div className='h-3 w-1/3 bg-gray-200 rounded'></div>
							<div className='h-3 w-1/4 bg-gray-200 rounded'></div>
						</div>
					))}
				</div>
				<div className='space-y-3'>
					{[...Array(2)].map((_, i) => (
						<div
							key={i}
							className='flex justify-between items-center'>
							<div className='h-3 w-1/3 bg-gray-200 rounded'></div>
							<div className='h-6 w-1/4 bg-gray-200 rounded-full'></div>
						</div>
					))}
				</div>
			</div>

			{/* Variants Skeleton */}
			{[...Array(2)].map((_, i) => (
				<div
					key={i}
					className='border border-slate-300 rounded-md p-4 bg-purple-50 space-y-3'>
					<div className='h-4 w-1/4 bg-gray-200 rounded'></div>
					<ul className='space-y-2'>
						{[...Array(3)].map((_, j) => (
							<li
								key={j}
								className='flex justify-between'>
								<div className='h-3 w-1/2 bg-gray-200 rounded'></div>
								<div className='h-3 w-1/6 bg-gray-200 rounded'></div>
							</li>
						))}
					</ul>
				</div>
			))}

			{/* Extras Skeleton */}
			<div className='border border-slate-300 rounded-md p-4 bg-purple-50'>
				<div className='h-4 w-1/4 bg-gray-200 rounded mb-2'></div>
				<ul className='space-y-2'>
					{[...Array(2)].map((_, i) => (
						<li
							key={i}
							className='flex justify-between'>
							<div className='h-3 w-1/2 bg-gray-200 rounded'></div>
							<div className='h-3 w-1/6 bg-gray-200 rounded'></div>
						</li>
					))}
				</ul>
			</div>

			{/* Totals Skeleton */}
			<div className='border-t border-slate-300 pt-4 space-y-2'>
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className='flex justify-between'>
						<div className='h-3 w-1/4 bg-gray-200 rounded'></div>
						<div className='h-3 w-1/6 bg-gray-200 rounded'></div>
					</div>
				))}
			</div>

			{/* Final Total Skeleton */}
			<div className='flex justify-between items-center border-t border-slate-300 pt-4'>
				<div className='h-4 w-1/6 bg-gray-200 rounded'></div>
				<div className='h-5 w-1/5 bg-gray-200 rounded'></div>
			</div>

			{/* Note Skeleton */}
			<div className='border border-yellow-200 bg-yellow-50 rounded-lg px-4 py-3'>
				<div className='h-4 w-full bg-gray-200 rounded'></div>
			</div>
		</div>
	);
};

export const PurchaseSummaryLoader = () => {
	return (
		<div className='p-4 border border-slate-300 rounded bg-purple-50 text-sm animate-pulse'>
			{/* Product Total */}
			<div className='flex justify-between items-center mb-3'>
				<div className='h-4 w-24 bg-gray-300 rounded'></div>
				<div className='h-4 w-16 bg-gray-300 rounded'></div>
			</div>

			{/* Discount */}
			<div className='flex justify-between items-center mb-3'>
				<div className='h-4 w-20 bg-gray-300 rounded'></div>
				<div className='h-4 w-12 bg-gray-300 rounded'></div>
			</div>

			{/* Extras Total */}
			<div className='flex justify-between items-center mb-3'>
				<div className='h-4 w-24 bg-gray-300 rounded'></div>
				<div className='h-4 w-16 bg-gray-300 rounded'></div>
			</div>

			{/* Quantity */}
			<div className='flex justify-between items-center mb-3'>
				<div className='h-4 w-20 bg-gray-300 rounded'></div>
				<div className='h-4 w-8 bg-gray-300 rounded'></div>
			</div>

			{/* Divider */}
			<div className='h-px bg-gray-300 my-3'></div>

			{/* Total */}
			<div className='flex justify-between items-center'>
				<div className='h-5 w-16 bg-gray-400 rounded'></div>
				<div className='h-5 w-20 bg-gray-400 rounded'></div>
			</div>
		</div>
	);
};
