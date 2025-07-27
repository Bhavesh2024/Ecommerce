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

export const ViewOrderLoader = () => {
	return (
		<div className='flex flex-col gap-4 w-full min-h-[80vh] justify-start p-4 mt-4 bg-slate-50 animate-pulse'>
			{/* Header Skeleton */}
			<div className='flex justify-between items-center px-4 md:px-6 w-full md:w-11/12 xl:w-4/5 mx-auto border border-slate-300 bg-white rounded-xl shadow-md py-4'>
				<div className='w-5 h-5 bg-slate-200 rounded'></div>
				<div className='h-6 bg-slate-200 rounded w-32'></div>
			</div>

			{/* Main Content Skeleton */}
			<div className='flex flex-col md:flex-row gap-4 w-full md:w-11/12 xl:w-4/5 mx-auto'>
				{/* Left Panel Skeleton */}
				<div className='md:w-2/5 w-full bg-white border border-slate-300 rounded-xl shadow-sm p-4 flex flex-col gap-4'>
					{/* Product Thumbnail Skeleton */}
					<div className='flex flex-col items-center text-center'>
						<div className='h-32 w-36 rounded-lg shadow-sm border border-slate-200 bg-slate-200'></div>
						<div className='mt-2 h-4 bg-slate-200 rounded w-3/4'></div>
					</div>

					{/* User Info Skeleton */}
					<div className='border-t pt-3 border-slate-200 space-y-4'>
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className='flex items-start gap-3 py-2'>
								<div className='w-5 h-5 bg-slate-200 rounded-full mt-1'></div>
								<div className='flex-1 space-y-2'>
									<div className='h-3 bg-slate-200 rounded w-1/4'></div>
									<div className='h-4 bg-slate-200 rounded w-3/4'></div>
								</div>
							</div>
						))}
					</div>

					{/* Status Skeleton */}
					<div className='flex flex-col gap-3 border-t pt-3 border-slate-200'>
						<div className='flex justify-between items-center'>
							<div className='h-3 bg-slate-200 rounded w-1/4'></div>
							<div className='h-6 bg-slate-200 rounded-full w-16'></div>
						</div>
						<div className='flex justify-between items-center'>
							<div className='h-3 bg-slate-200 rounded w-1/4'></div>
							<div className='h-6 bg-slate-200 rounded-full w-16'></div>
						</div>
					</div>
				</div>

				{/* Right Panel Skeleton */}
				<div className='w-full md:w-3/5 h-full bg-white border border-slate-300 rounded-xl shadow-sm p-4'>
					<div className='space-y-4'>
						{/* Order Summary Header */}
						<div className='h-6 bg-slate-200 rounded w-1/3 mb-4'></div>

						{/* Order Items */}
						<div className='border-b pb-3 border-slate-200'>
							<div className='flex justify-between mb-2'>
								<div className='h-4 bg-slate-200 rounded w-1/4'></div>
								<div className='h-4 bg-slate-200 rounded w-16'></div>
							</div>
							<div className='h-3 bg-slate-200 rounded w-1/2'></div>
						</div>

						{/* Extras */}
						<div className='border-b pb-3 border-slate-200'>
							<div className='h-4 bg-slate-200 rounded w-1/4 mb-2'></div>
							{[...Array(2)].map((_, i) => (
								<div
									key={i}
									className='flex justify-between py-1'>
									<div className='h-3 bg-slate-200 rounded w-1/3'></div>
									<div className='h-3 bg-slate-200 rounded w-16'></div>
								</div>
							))}
						</div>

						{/* Totals */}
						<div className='space-y-2 pt-2'>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className='flex justify-between'>
									<div className='h-4 bg-slate-200 rounded w-1/4'></div>
									<div className='h-4 bg-slate-200 rounded w-16'></div>
								</div>
							))}
							<div className='flex justify-between pt-2'>
								<div className='h-5 bg-slate-200 rounded w-1/4'></div>
								<div className='h-5 bg-slate-200 rounded w-20'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const ViewProductLoader = () => {
	return (
		<div className='max-w-6xl mx-auto p-4 md:p-6 rounded-lg animate-pulse'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Image Gallery Skeleton */}
				<div className='space-y-4'>
					{/* Main Image */}
					<div className='relative rounded-lg overflow-hidden bg-gray-200 aspect-square border border-gray-300'></div>

					{/* Thumbnails */}
					<div>
						<div className='h-5 w-40 bg-gray-200 rounded mb-2'></div>
						<div className='grid grid-cols-4 gap-2'>
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className='relative rounded-md overflow-hidden bg-gray-200 aspect-square border border-gray-300'></div>
							))}
						</div>
					</div>
				</div>

				{/* Product Details Skeleton */}
				<div className='space-y-6'>
					{/* Pricing Section */}
					<div className='bg-gray-100 p-4 rounded-lg border border-gray-200'>
						<div className='h-6 w-48 bg-gray-200 rounded mb-3'></div>
						<div className='grid grid-cols-2 gap-4'>
							{[...Array(4)].map((_, i) => (
								<div key={i}>
									<div className='h-4 w-20 bg-gray-200 rounded mb-1'></div>
									<div className='h-5 w-24 bg-gray-300 rounded'></div>
								</div>
							))}
						</div>
					</div>

					{/* Inventory Section */}
					<div className='bg-gray-100 p-4 rounded-lg border border-gray-200'>
						<div className='h-6 w-48 bg-gray-200 rounded mb-3'></div>
						<div className='grid grid-cols-2 gap-4'>
							{[...Array(4)].map((_, i) => (
								<div key={i}>
									<div className='h-4 w-20 bg-gray-200 rounded mb-1'></div>
									<div className='h-5 w-24 bg-gray-300 rounded'></div>
								</div>
							))}
						</div>
					</div>

					{/* Description */}
					<div className='bg-gray-100 p-4 rounded-lg border border-gray-200'>
						<div className='h-6 w-48 bg-gray-200 rounded mb-3'></div>
						<div className='space-y-2'>
							<div className='h-4 bg-gray-200 rounded w-full'></div>
							<div className='h-4 bg-gray-200 rounded w-5/6'></div>
							<div className='h-4 bg-gray-200 rounded w-4/6'></div>
							<div className='h-4 bg-gray-200 rounded w-3/6'></div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom Sections */}
			<div className='mt-5 flex flex-col md:flex-row w-full gap-4'>
				{/* Variants Skeleton */}
				<div className='bg-gray-100 p-4 rounded-lg border border-gray-200 w-full md:w-1/2'>
					<div className='h-6 w-48 bg-gray-200 rounded mb-3'></div>
					<div className='space-y-4'>
						{[...Array(2)].map((_, i) => (
							<div key={i}>
								<div className='h-5 w-32 bg-gray-200 rounded mb-2'></div>
								<div className='overflow-x-auto'>
									<div className='min-w-full divide-y divide-gray-300'>
										<div className='bg-gray-200 py-2'>
											<div className='grid grid-cols-2'>
												<div className='px-3 py-1 h-4 bg-gray-300 rounded w-3/4'></div>
												<div className='px-3 py-1 h-4 bg-gray-300 rounded w-3/4'></div>
											</div>
										</div>
										{[...Array(3)].map(
											(_, j) => (
												<div
													key={
														j
													}
													className='grid grid-cols-2 py-2'>
													<div className='px-3 py-1 h-4 bg-gray-200 rounded w-2/3'></div>
													<div className='px-3 py-1 h-4 bg-gray-200 rounded w-1/3'></div>
												</div>
											),
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Extras Skeleton */}
				<div className='bg-gray-100 p-4 rounded-lg border border-gray-200 w-full md:w-1/2'>
					<div className='h-6 w-48 bg-gray-200 rounded mb-3'></div>
					<div className='overflow-x-auto'>
						<div className='min-w-full divide-y divide-gray-300'>
							<div className='bg-gray-200 py-2'>
								<div className='grid grid-cols-3'>
									<div className='px-3 py-1 h-4 bg-gray-300 rounded w-1/4'></div>
									<div className='px-3 py-1 h-4 bg-gray-300 rounded w-3/4'></div>
									<div className='px-3 py-1 h-4 bg-gray-300 rounded w-1/4'></div>
								</div>
							</div>
							{[...Array(3)].map((_, i) => (
								<div
									key={i}
									className='grid grid-cols-3 py-2'>
									<div className='px-3 py-1 h-4 bg-gray-200 rounded w-1/6'></div>
									<div className='px-3 py-1 h-4 bg-gray-200 rounded w-2/3'></div>
									<div className='px-3 py-1 h-4 bg-gray-200 rounded w-1/6'></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
