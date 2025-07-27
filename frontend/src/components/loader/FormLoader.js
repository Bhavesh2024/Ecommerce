"use client";
import React from "react";

export const EditProfileFormLoader = () => {
	return (
		<div className='w-full max-w-3xl mx-auto p-6 animate-pulse'>
			{/* Header */}
			<div className='text-center md:text-start mb-6'>
				<div className='h-8 bg-gray-200 rounded w-1/3 mx-auto md:mx-0 mb-2'></div>
				<div className='h-4 bg-gray-200 rounded w-2/3 mx-auto md:mx-0'></div>
			</div>

			{/* Form Content */}
			<div className='space-y-6'>
				{/* Profile Image + Basic Info */}
				<div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
					{/* Profile Image */}
					<div className='flex flex-col items-center'>
						<div className='w-36 h-36 bg-gray-200 rounded-full md:rounded'></div>
						<div className='mt-3 w-36 h-10 bg-gray-200 rounded-full md:rounded'></div>
					</div>

					{/* Basic Info Fields */}
					<div className='flex flex-col gap-3 w-full'>
						<div className='h-10 bg-gray-200 rounded'></div>
						<div className='h-10 bg-gray-200 rounded'></div>
						<div className='h-10 bg-gray-200 rounded'></div>
					</div>
				</div>

				{/* Contact Info */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
					<div className='h-10 bg-gray-200 rounded'></div>
					<div className='h-10 bg-gray-200 rounded'></div>
				</div>

				{/* Address Section */}
				<div className='space-y-3'>
					<div className='h-20 bg-gray-200 rounded'></div>
					<div className='h-10 bg-gray-200 rounded w-32'></div>
				</div>

				{/* Submit Button */}
				<div className='h-10 bg-gray-200 rounded w-full md:w-32'></div>
			</div>
		</div>
	);
};

export const CheckoutFormLoader = () => {
	return (
		<div className='w-11/12 md:w-10/12 lg:w-4/5 xl:w-3/4 mx-auto p-3 md:p-6 bg-white rounded lg:shadow animate-pulse'>
			{/* Product Title */}
			<div className='h-6 w-1/4 bg-gray-200 rounded mb-4'></div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{/* Left Column - Product Options */}
				<div className='space-y-6'>
					{/* Variant Groups */}
					{[...Array(2)].map((_, groupIdx) => (
						<div key={groupIdx}>
							<div className='h-4 w-1/3 bg-gray-200 rounded mb-2'></div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{[...Array(4)].map(
									(_, variantIdx) => (
										<div
											key={
												variantIdx
											}
											className='border border-gray-200 p-3 rounded flex justify-between items-center'>
											<div className='space-y-2'>
												<div className='h-4 w-20 bg-gray-200 rounded'></div>
												<div className='h-3 w-12 bg-gray-200 rounded'></div>
											</div>
											<div className='flex items-center space-x-2'>
												<div className='h-6 w-6 bg-gray-200 rounded'></div>
												<div className='h-4 w-4 bg-gray-200 rounded'></div>
												<div className='h-6 w-6 bg-gray-200 rounded'></div>
											</div>
										</div>
									),
								)}
							</div>
						</div>
					))}

					{/* Extras */}
					<div>
						<div className='h-4 w-1/4 bg-gray-200 rounded mb-2'></div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
							{[...Array(4)].map((_, idx) => (
								<div
									key={idx}
									className='h-12 bg-gray-100 rounded border border-gray-200'></div>
							))}
						</div>
					</div>

					{/* Quantity */}
					<div>
						<div className='h-4 w-1/4 bg-gray-200 rounded mb-2'></div>
						<div className='h-10 bg-gray-200 rounded'></div>
					</div>

					{/* Order Summary */}
					<div className='p-4 border border-gray-200 rounded bg-gray-100 space-y-3'>
						{[...Array(5)].map((_, idx) => (
							<div
								key={idx}
								className='flex justify-between'>
								<div className='h-3 w-1/3 bg-gray-300 rounded'></div>
								<div className='h-3 w-1/4 bg-gray-300 rounded'></div>
							</div>
						))}
						<div className='h-px bg-gray-300 my-2'></div>
						<div className='flex justify-between'>
							<div className='h-4 w-1/4 bg-gray-300 rounded'></div>
							<div className='h-4 w-1/4 bg-gray-300 rounded'></div>
						</div>
					</div>
				</div>

				{/* Right Column - Customer Info */}
				<div className='space-y-4'>
					{/* Customer Info */}
					<div className='space-y-3'>
						{[...Array(3)].map((_, idx) => (
							<div key={idx}>
								<div className='h-3 w-1/4 bg-gray-200 rounded mb-1'></div>
								<div className='h-10 bg-gray-200 rounded'></div>
							</div>
						))}
					</div>

					{/* Payment Method */}
					<div>
						<div className='h-3 w-1/3 bg-gray-200 rounded mb-1'></div>
						<div className='h-16 bg-gray-100 rounded border border-gray-200'></div>
					</div>

					{/* Purchase Notes */}
					<div className='bg-gray-100 p-3 rounded space-y-2'>
						<div className='h-4 w-1/3 bg-gray-300 rounded'></div>
						<div className='space-y-1'>
							{[...Array(5)].map((_, idx) => (
								<div
									key={idx}
									className='h-3 w-full bg-gray-300 rounded'></div>
							))}
						</div>
					</div>

					{/* Submit Button */}
					<div className='h-10 bg-gray-300 rounded'></div>
				</div>
			</div>
		</div>
	);
};

export const ProductFormLoader = () => {
	return (
		<div className='p-4 space-y-6 w-full mx-auto rounded-lg animate-pulse'>
			{/* Image Upload Section */}
			<div className='space-y-2'>
				<div className='h-5 w-32 bg-gray-200 rounded'></div>
				<div className='h-32 w-full bg-gray-100 rounded-lg'></div>
			</div>

			{/* Basic Information */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className='space-y-1'>
						<div className='h-4 w-24 bg-gray-200 rounded'></div>
						<div className='h-10 bg-gray-100 rounded-md'></div>
					</div>
				))}
			</div>

			{/* Description */}
			<div className='space-y-1'>
				<div className='h-4 w-24 bg-gray-200 rounded'></div>
				<div className='h-32 bg-gray-100 rounded-md'></div>
			</div>

			{/* Variants Section */}
			<div className='space-y-4'>
				<div className='h-6 w-40 bg-gray-200 rounded'></div>
				<div className='space-y-4'>
					{[...Array(2)].map((_, i) => (
						<div
							key={i}
							className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4'>
							<div className='flex gap-3 items-center'>
								<div className='flex-1 space-y-2'>
									<div className='h-4 w-24 bg-gray-200 rounded'></div>
									<div className='h-10 bg-gray-100 rounded-md'></div>
								</div>
								<div className='h-10 w-10 bg-gray-200 rounded-md mt-6'></div>
							</div>

							<div className='mt-3 space-y-2'>
								<div className='h-4 w-20 bg-gray-200 rounded'></div>
								{[...Array(2)].map((_, j) => (
									<div
										key={j}
										className='flex gap-2'>
										<div className='h-10 bg-gray-100 rounded-md flex-1'></div>
										<div className='h-10 bg-gray-100 rounded-md flex-1'></div>
										<div className='h-10 w-10 bg-gray-200 rounded-md'></div>
									</div>
								))}
								<div className='h-10 bg-gray-200 rounded-md mt-2'></div>
							</div>
						</div>
					))}
					<div className='h-10 bg-gray-200 rounded-md'></div>
				</div>
			</div>

			{/* Extras Section */}
			<div className='space-y-4'>
				<div className='h-6 w-32 bg-gray-200 rounded'></div>
				<div className='space-y-3'>
					{[...Array(2)].map((_, i) => (
						<div
							key={i}
							className='flex gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm'>
							<div className='h-10 bg-gray-100 rounded-md flex-1'></div>
							<div className='h-10 bg-gray-100 rounded-md flex-1'></div>
							<div className='h-10 w-10 bg-gray-200 rounded-md'></div>
						</div>
					))}
					<div className='h-10 bg-gray-200 rounded-md'></div>
				</div>
			</div>

			{/* Status and Actions */}
			<div className='flex items-center justify-between pt-4 border-t border-gray-200'>
				<div className='flex items-center space-x-3'>
					<div className='w-11 h-6 bg-gray-200 rounded-full'></div>
					<div className='h-4 w-24 bg-gray-200 rounded'></div>
				</div>
				<div className='flex gap-3'>
					<div className='h-10 w-24 bg-gray-200 rounded-md'></div>
					<div className='h-10 w-24 bg-gray-300 rounded-md'></div>
				</div>
			</div>
		</div>
	);
};
