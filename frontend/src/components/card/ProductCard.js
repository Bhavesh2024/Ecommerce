"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "../modal/Modal";

const ProductCard = ({ product, showViewMore = true }) => {
	const router = useRouter();
	if (!product.status) return;
	return (
		<div
			className='max-w-xs bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-400'
			onClick={() => router.push(`/product/${product.slug}`)}>
			<img
				src={`${product.thumbnail || product.images[0].url}`}
				alt={product.title}
				className='w-full h-48 object-fill'
			/>
			<div className='mt-2 flex justify-between items-center px-3 pt-1'>
				<h2 className='text-lg font-semibold text-gray-800 truncate'>
					{product.title}
				</h2>
				<p className='text-sm text-gray-700'>
					<span className='font-medium'>Price:</span> ₹
					{product.price}
				</p>
			</div>
			<div className='px-3 py-1'>
				<p className='text-sm text-gray-600 mt-1'>
					{product.description.length > 50
						? `${product.description.slice(0, 50)}...`
						: product.description}
				</p>

				{showViewMore && (
					<div className='flex justify-end items-center mt-3 mb-1'>
						<a
							href={`/product/${product.slug}`}
							className='text-sm text-sky-600 hover:underline'>
							View More
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
