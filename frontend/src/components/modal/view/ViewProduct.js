"use client";

import { format } from "date-fns";
import { Box, Tag, Info, Layers, BarChart2, Maximize2 } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

import { ProductInfoCard } from "@/components/card/InfoCard";
import { ProductImageModal } from "../image/ImagePreviewModal";
import { ProductImageThumbnail } from "@/components/thumbnail/Thumbnail";
import { ProductTable } from "@/components/product/ProductTable";
import { categories } from "@/utils/helper/category";

const ViewProduct = ({ data }) => {
	const [selectedImage, setSelectedImage] = useState(null);

	if (!data) return null;

	const {
		title,
		category,
		description,
		price: defaultPrice,
		discount = 0,
		prices = [],
		images = [],
		extras = [],
		stockCount,
		stockStatus,
		thumbnail,
		status,
		createdAt,
		updatedAt,
	} = data;

	const finalPrice = defaultPrice - (defaultPrice * discount) / 100;

	const variantsData = prices.flatMap((p) =>
		p.variants.map((v) => ({ ...v, type: p.type })),
	);

	const variantColumns = [
		{ header: "Type", accessor: (item) => item.type },
		{ header: "Option", accessor: (item) => item.label },
		{ header: "Price", accessor: (item) => `₹${item.value}` },
	];

	const extraColumns = [
		{ header: "#", accessor: (_, idx) => idx + 1 },
		{ header: "Extra Name", accessor: (item) => item.name },
		{ header: "Price", accessor: (item) => `₹${item.price}` },
	];

	return (
		<div className='max-w-6xl mx-auto p-4 md:p-6 rounded-lg'>
			<ProductImageModal
				selectedImage={selectedImage}
				onClose={() => setSelectedImage(null)}
			/>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Image Gallery */}
				<div className='space-y-4'>
					<div className='relative rounded-lg overflow-hidden bg-gray-100 aspect-square border border-gray-200 cursor-pointer group'>
						<Image
							src={thumbnail}
							alt={title}
							width={600}
							height={600}
							className='w-full h-full object-contain'
							priority
						/>
						{discount > 0 && (
							<div className='absolute top-3 left-3 bg-purple-700 text-white px-2 py-1 rounded text-xs font-semibold'>
								{discount}% OFF
							</div>
						)}
						<div
							className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
							onClick={() =>
								setSelectedImage(thumbnail)
							}>
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
								<ProductImageThumbnail
									src={thumbnail}
									alt={`${title} - Thumbnail`}
									label='Thumbnail'
									isFeatured
									onClick={() =>
										setSelectedImage(
											thumbnail,
										)
									}
								/>
								{images.map((img, i) => (
									<ProductImageThumbnail
										key={i}
										src={img.url}
										alt={`${title} - ${
											img.label ||
											`Image ${
												i + 1
											}`
										}`}
										label={img.label}
										onClick={() =>
											setSelectedImage(
												img.url,
											)
										}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Product Details */}
				<div className='space-y-6'>
					{/* Pricing Info */}
					<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
						<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
							<Tag className='w-5 h-5 text-purple-700' />
							Pricing Information
						</h3>
						<div className='grid grid-cols-2 gap-4'>
							<ProductInfoCard
								title='Base Price'
								value={`₹${defaultPrice}`}
							/>
							<ProductInfoCard
								title='Discount'
								value={`${discount}%`}
							/>
							<ProductInfoCard
								title='Final Price'
								value={`₹${finalPrice.toFixed(
									2,
								)}`}
								valueClassName='text-purple-700 font-semibold'
							/>
							<ProductInfoCard
								title='Status'
								value={
									status
										? "Active"
										: "Inactive"
								}
								valueClassName={
									status
										? "text-green-600"
										: "text-red-600"
								}
							/>
							<ProductInfoCard
								title='Category'
								value={
									categories[category] ||
									category
								}
							/>
						</div>
					</div>

					{/* Inventory Info */}
					<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
						<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
							<Box className='w-5 h-5 text-purple-700' />
							Inventory Status
						</h3>
						<div className='grid grid-cols-2 gap-4'>
							<ProductInfoCard
								title='Stock Count'
								value={`${stockCount} ${
									stockCount > 0
										? "available"
										: "out of stock"
								}`}
								valueClassName={
									stockCount > 0
										? "text-gray-800"
										: "text-red-600"
								}
							/>
							<ProductInfoCard
								title='Availability'
								value={
									stockStatus
										? "In Stock"
										: "Out of Stock"
								}
								valueClassName={
									stockStatus
										? "text-green-600"
										: "text-red-600"
								}
							/>
							<ProductInfoCard
								title='Created On'
								value={format(
									new Date(createdAt),
									"dd MMM yyyy",
								)}
							/>
							<ProductInfoCard
								title='Last Updated'
								value={format(
									new Date(updatedAt),
									"dd MMM yyyy",
								)}
							/>
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

			{/* Bottom Section */}
			<div className='mt-5 flex flex-col md:flex-row w-full gap-4'>
				<ProductTable
					data={variantsData}
					columns={variantColumns}
					title='Product Variants'
					icon={BarChart2}
					className='w-full md:w-1/2'
				/>
				<ProductTable
					data={extras}
					columns={extraColumns}
					title='Product Extras'
					icon={Layers}
					className='w-full md:w-1/2'
				/>
			</div>
		</div>
	);
};

export default ViewProduct;
