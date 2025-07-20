"use client";

import { format } from "date-fns";
import {
	Check,
	X,
	Box,
	Tag,
	Info,
	Layers,
	BarChart2,
	Edit,
	Maximize2,
} from "lucide-react";
import React, { useState } from "react";

const ViewProduct = ({ data, onClose, onEdit, hideClose = false }) => {
	if (!data) return null;

	const {
		title,
		category,
		description,
		price: defaultPrice,
		discount,
		prices,
		images,
		extras,
		stockCount,
		stockStatus,
		thumbnail,
		status,
		createdAt,
		updatedAt,
	} = data;

	const [selectedImage, setSelectedImage] = useState(null);
	const finalPrice = defaultPrice - (defaultPrice * discount) / 100;
	console.log(defaultPrice);
	return (
		<>
			<div className='max-w-6xl mx-auto p-4 md:p-6  rounded-lg '>
				{/* Image Modal */}
				{selectedImage && (
					<div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
						<button
							onClick={() => setSelectedImage(null)}
							className='absolute top-4 right-4 text-white p-2'>
							<X className='w-6 h-6' />
						</button>
						<img
							src={selectedImage}
							alt='Enlarged product view'
							className='max-h-full max-w-full object-contain'
						/>
					</div>
				)}

				{/* Header with actions */}
				{/* <div className='flex justify-between items-start mb-6'>
				<div>
					<h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
						{title}
						<span
							className={`text-xs px-2 py-1 rounded-full ${
								status
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}>
							{status ? "Active" : "Inactive"}
						</span>
					</h2>
					<div className='flex items-center gap-3 text-sm text-gray-500 mt-1'>
						<span className='flex items-center gap-1'>
							<Tag className='w-4 h-4 text-purple-700' />
							{category}
						</span>
						<span className='flex items-center gap-1'>
							<Box className='w-4 h-4 text-purple-700' />
							Stock: {stockCount}
						</span>
					</div>
				</div>

				<div className='flex gap-2'>
					{onEdit && (
						<button
							onClick={onEdit}
							className='p-2 rounded-md hover:bg-gray-100 transition-colors text-purple-700'
							aria-label='Edit'
							title='Edit Product'>
							<Edit className='w-5 h-5' />
						</button>
					)}
					{hideClose && (
						<button
							onClick={onClose}
							className='p-2 rounded-md hover:bg-gray-100 transition-colors text-gray-500'
							aria-label='Close'>
							<X className='w-5 h-5' />
						</button>
					)}
				</div>
			</div> */}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Image Gallery */}
					<div className='space-y-4'>
						{/* Main Image */}
						<div
							className='relative rounded-lg overflow-hidden bg-gray-100 aspect-square border border-gray-200 cursor-pointer group'
							onClick={() =>
								setSelectedImage(thumbnail)
							}>
							<img
								src={thumbnail}
								alt={title}
								className='w-full h-full object-contain'
							/>
							{discount > 0 && (
								<div className='absolute top-3 left-3 bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold'>
									{discount}% OFF
								</div>
							)}
							<div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
								<Maximize2 className='w-8 h-8 text-white' />
							</div>
						</div>

						{/* Thumbnails */}
						{images?.length > 0 && (
							<div>
								<h3 className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
									<Layers className='w-4 h-4 text-purple-700' />
									Product Images (
									{images.length + 1})
								</h3>
								<div className='grid grid-cols-4 gap-2'>
									{/* Include thumbnail in the gallery */}
									<div
										className='relative rounded-md overflow-hidden bg-gray-100 aspect-square border-2 border-purple-700 cursor-pointer'
										onClick={() =>
											setSelectedImage(
												thumbnail,
											)
										}>
										<img
											src={
												thumbnail
											}
											alt={`${title} - Thumbnail`}
											className='w-full h-full object-cover'
										/>
										<div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center truncate'>
											Thumbnail
										</div>
									</div>

									{images.map((img, i) => (
										<div
											key={i}
											className='relative rounded-md overflow-hidden bg-gray-100 aspect-square border border-gray-200 cursor-pointer'
											onClick={() =>
												setSelectedImage(
													img.url,
												)
											}>
											<img
												src={
													img.url
												}
												alt={`${title} - ${
													img.label ||
													`Image ${
														i +
														1
													}`
												}`}
												className='w-full h-full object-cover'
											/>
											{img.label && (
												<div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center truncate'>
													{
														img.label
													}
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Product Details */}
					<div className='space-y-6'>
						{/* Pricing Section */}
						<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
							<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<Tag className='w-5 h-5 text-purple-700' />
								Pricing Information
							</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-gray-500'>
										Base Price
									</p>
									<p className='font-medium'>
										₹{defaultPrice}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Discount
									</p>
									<p className='font-medium'>
										{discount}%
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Final Price
									</p>
									<p className='text-purple-700 font-semibold'>
										₹
										{finalPrice.toFixed(
											2,
										)}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Status
									</p>
									<p
										className={`font-medium ${
											status
												? "text-green-600"
												: "text-red-600"
										}`}>
										{status
											? "Active"
											: "Inactive"}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Category
									</p>
									<p
										className={`font-medium`}>
										{category}
									</p>
								</div>
							</div>
						</div>

						{/* Inventory Section */}
						<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
							<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
								<Box className='w-5 h-5 text-purple-700' />
								Inventory Status
							</h3>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-gray-500'>
										Stock Count
									</p>
									<p
										className={`font-medium ${
											stockCount > 0
												? "text-gray-800"
												: "text-red-600"
										}`}>
										{stockCount}{" "}
										{stockCount > 0
											? "available"
											: "out of stock"}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Availability
									</p>
									<p
										className={`font-medium ${
											stockStatus
												? "text-green-600"
												: "text-red-600"
										}`}>
										{stockStatus
											? "In Stock"
											: "Out of Stock"}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Created On
									</p>
									<p className='font-medium'>
										{format(
											new Date(
												createdAt,
											),
											"dd MMM yyyy",
										)}
									</p>
								</div>
								<div>
									<p className='text-sm text-gray-500'>
										Last Updated
									</p>
									<p className='font-medium'>
										{format(
											new Date(
												updatedAt,
											),
											"dd MMM yyyy",
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Description */}
						{description && (
							<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
								<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
									<Info className='w-5 h-5 text-purple-700' />
									Product Description
								</h3>
								<p className='text-gray-700 whitespace-pre-line'>
									{description}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className='mt-5 flex flex-col md:flex-row w-full gap-1 '>
				{/* Variants */}
				{prices?.length > 0 && (
					<div className='md:bg-gray-50 p-4 rounded-lg md:border md:border-gray-200 w-full md:w-1/2'>
						<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
							<BarChart2 className='w-5 h-5 text-purple-700' />
							Product Variants
						</h3>
						<div className='space-y-4'>
							{prices.map((p, i) => (
								<div key={i}>
									<h4 className='font-medium text-gray-700 mb-2'>
										{p.type} Options:
									</h4>
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-100'>
												<tr>
													<th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Option
													</th>
													<th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Price
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{p.variants.map(
													(
														v,
														j,
													) => (
														<tr
															key={`${i}-${j}`}>
															<td className='px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
																{
																	v.label
																}
															</td>
															<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
																₹
																{
																	v.value
																}
															</td>
														</tr>
													),
												)}
											</tbody>
										</table>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Extras */}
				{extras?.length > 0 && (
					<div className='md:bg-gray-50 p-4 rounded-lg md:border md:border-gray-200 md:w-1/2 h-fit'>
						<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
							<Layers className='w-5 h-5 text-purple-700' />
							Product Extras
						</h3>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-100'>
									<tr>
										<th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											#
										</th>
										<th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Extra Name
										</th>
										<th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Price
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{extras.map(
										(extra, i) => (
											<tr key={i}>
												<td className='px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
													{i +
														1}
												</td>
												<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-900'>
													{
														extra.name
													}
												</td>
												<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
													₹
													{
														extra.price
													}
												</td>
											</tr>
										),
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ViewProduct;
