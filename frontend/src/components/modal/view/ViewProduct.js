"use client";

import { Check, CircleCheck, Info, X } from "lucide-react";
import React from "react";

const ViewProduct = ({ data, onClose }) => {
	if (!data) return null;

	const {
		title,
		category,
		description,
		defaultPrice,
		discount,
		prices,
		images,
		extras,
		stockCount,
		stockStatus,
		thumbnail,
		status,
	} = data;

	const finalPrice = defaultPrice - (defaultPrice * discount) / 100;

	return (
		<div className='px-4 pb-2 bg-white rounded-md relative max-w-lg'>
			<h2 className='text-xl mb-2 font-semibold text-gray-800 p-1'>
				{title}
			</h2>
			{/* Thumbnail */}
			<div className='overflow-hidden relative  grid  grid-cols-2 md:grid-cols-3 my-3'>
				<div className='relative'>
					<img
						src={thumbnail}
						alt={`Thumbnail`}
						className='w-full h-32 object-fill border border-slate-400 rounded bg-sky-200'
					/>
					<span className='absolute bottom-1 end-1 bg-neutral-950/50 flex items-center gap-1 p-1 rounded-md text-emerald-300  text-xs'>
						<Check className='size-4' />
					</span>
				</div>
			</div>
			{/* Images */}
			{images?.length > 0 && (
				<div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
					{images.map(
						(img, i) =>
							thumbnail !== img.url && (
								<div
									key={i}
									className='border rounded overflow-hidden relative border-slate-200'>
									<img
										src={img.url}
										alt={`Image ${i}`}
										className='w-full h-32 object-fill'
									/>
									{img.label && (
										<div className='text-xs p-1 text-center'>
											{img.label}
										</div>
									)}
								</div>
							),
					)}
				</div>
			)}

			{/* Basic Info */}
			<div className='grid grid-cols-3 mt-5 gap-4 justify-between'>
				<div>
					<p className='text-gray-600 text-xs'>Category</p>
					<p className='text-gray-800 font-medium'>
						{category}
					</p>
				</div>
				<div className=''>
					<p className='text-gray-600 text-xs'>
						Base Price
					</p>
					<p className='text-gray-800 font-medium'>
						₹{defaultPrice}
					</p>
				</div>
				<div>
					<p className='text-gray-600 text-xs'>Discount</p>
					<p className='text-gray-800 font-medium'>
						{discount}%
					</p>
				</div>
				<div>
					<p className='text-gray-600 text-xs'>
						Final Price
					</p>
					<p className='text-blue-400 font-semibold'>
						₹{finalPrice.toFixed(2)}
					</p>
				</div>
				<div>
					<p className='text-gray-600 text-xs'>
						Stock Count
					</p>
					<p className='text-gray-800 font-medium'>
						{stockCount}
					</p>
				</div>
				<div>
					<p className='text-gray-600 text-xs'>
						Stock Status
					</p>
					<p
						className={`${
							stockStatus
								? "text-emerald-500"
								: "text-red-500"
						} font-medium`}>
						{stockStatus ? "In Stock" : "Out of Stock"}
					</p>
				</div>
				<div className='flex justify-center items-center bg-black/60 py-2 rounded-md gap-1 absolute top-0 end-2 min-w-20 mt-1 '>
					<div
						className={`size-3 rounded-full ${
							status
								? "bg-indigo-400"
								: "bg-red-500"
						}`}></div>
					<p className={`text-xs text-white`}>
						{status ? "Active" : "Deactive"}
					</p>
				</div>
			</div>

			{/* Description */}
			{description && (
				<div>
					<p className='text-gray-600 text-xs mt-3'>
						Description
					</p>
					<p className='text-gray-800 text-sm'>
						{description}
					</p>
				</div>
			)}

			{/* Price Variants Table */}
			{prices?.length > 0 && (
				<div className='my-5'>
					<h3 className='text-gray-500 font-semibold text-sm mb-2'>
						Variants
					</h3>
					{prices.map((p, i) => (
						<table className='w-full text-sm text-left border border-slate-200 rounded'>
							<thead className='bg-slate-100 text-slate-600'>
								<tr>
									<th className='py-2 px-3 border'>
										#
									</th>
									<th className='py-2 px-3 border'>
										{p.type}
									</th>
									<th className='py-2 px-3 border'>
										Price
									</th>
								</tr>
							</thead>
							<tbody>
								{p.variants.map((v, j) => (
									<tr
										key={`${i}-${j}`}
										className='border-t'>
										<td className='py-2 px-3 border'>
											{j + 1}
										</td>
										<td className='py-2 px-3 border'>
											{v.label}
										</td>
										<td className='py-2 px-3 border'>
											₹{v.value}
										</td>
									</tr>
								))}
								,
							</tbody>
						</table>
					))}
				</div>
			)}

			{/* Extras Table */}
			{extras?.length > 0 && (
				<div className='mb-6'>
					<h3 className='text-gray-500 font-semibold text-sm mb-2'>
						Extras
					</h3>
					<table className='w-full text-sm text-left border border-slate-200 rounded'>
						<thead className='bg-slate-100 text-slate-600'>
							<tr>
								<th className='py-2 px-3 border'>
									#
								</th>
								<th className='py-2 px-3 border'>
									Name
								</th>
								<th className='py-2 px-3 border'>
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							{extras.map((extra, i) => (
								<tr
									key={i}
									className='border-t'>
									<td className='py-2 px-3 border'>
										{i + 1}
									</td>
									<td className='py-2 px-3 border'>
										{extra.name}
									</td>
									<td className='py-2 px-3 border'>
										₹{extra.price}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<button
				className='flex items-center justify-center text-sm h-10 w-20 rounded-md bg-neutral-900 text-white mx-auto'
				onClick={onClose}>
				Close
			</button>
		</div>
	);
};

export default ViewProduct;
