import React from "react";

export const ProductImageGalleryLoader = () => {
	return (
		<div className='bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse'>
			<div className='relative aspect-square w-full overflow-hidden h-60'>
				{/* Main Image Skeleton */}
				<div className='w-full h-60 bg-gray-200'></div>

				{/* Navigation Arrows Skeleton */}
				<div className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10'>
					<div className='h-5 w-5 bg-gray-300 rounded-full'></div>
				</div>
				<div className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md z-10'>
					<div className='h-5 w-5 bg-gray-300 rounded-full'></div>
				</div>

				{/* Dots Indicator Skeleton */}
				<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
					{[...Array(4)].map((_, index) => (
						<div
							key={index}
							className='w-2 h-2 rounded-full bg-gray-300'
						/>
					))}
				</div>
			</div>

			{/* Thumbnail Strip Skeleton */}
			<div className='p-4 border-t border-gray-100 grid grid-cols-4 gap-2'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className='aspect-square border rounded-md overflow-hidden bg-gray-200'
					/>
				))}
			</div>
		</div>
	);
};

export const PricingTableLoader = () => {
	return (
		<div className='mb-8 animate-pulse'>
			<div className='h-6 w-1/4 bg-gray-200 rounded mb-4'></div>

			<div className='space-y-2'>
				{/* Table Header */}
				<div className='h-8 bg-gray-100 rounded'></div>

				{/* Table Rows */}
				{[...Array(3)].map((_, idx) => (
					<div
						key={idx}
						className='h-12 bg-gray-50 rounded'></div>
				))}
			</div>
		</div>
	);
};
