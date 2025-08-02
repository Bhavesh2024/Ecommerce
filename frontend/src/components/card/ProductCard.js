"use client";
import { formatPrice } from "@/utils/helper/formatter";
import { defaultProductImage } from "@/utils/helper/web-content";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ProductCard = ({ product, showViewMore = true }) => {
	const router = useRouter();
	const [isHovered, setIsHovered] = useState(false);
	const [productImage, setProductImage] = useState(
		product.thumbnail || product?.images[0]?.url,
	);
	if (!product.status) return null;

	return (
		<div
			className='relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-0 group cursor-pointer'
			onClick={() => router.push(`/product/${product.slug}`)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}>
			{/* Floating price tag effect */}
			<div
				className={`absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md ${
					isHovered
						? "scale-110 -translate-y-1"
						: "scale-100"
				} transition-transform duration-300`}>
				<span className='font-bold text-purple-700 text-sm'>
					{formatPrice(product.price)}
				</span>
			</div>

			{/* Dynamic image container */}
			<div className='relative aspect-[4/3] overflow-hidden'>
				<Image
					src={productImage}
					placeholder='blur'
					blurDataURL={defaultProductImage}
					height={100}
					width={100}
					alt={product.name}
					className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
						isHovered
							? "scale-105 brightness-110"
							: "scale-100 brightness-100"
					}`}
					onError={() => {
						if (productImage !== defaultProductImage)
							setProductImage(defaultProductImage);
					}}
				/>
				<div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20' />
			</div>

			{/* Content reveal animation */}
			<div
				className={`p-5 transition-all duration-500 ${
					isHovered ? "bg-white" : "bg-gray-50"
				}`}>
				<h3 className='font-semibold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight'>
					{product.name}
				</h3>

				{showViewMore && (
					<div className='flex gap-3 mt-4'>
						<a
							href={`/product/${product.slug}/checkout`}
							onClick={(e) => e.stopPropagation()}
							className='flex-1 flex items-center text-nowrap justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0'>
							<ShoppingCart className='h-5 w-5' />
							<span>BUY NOW</span>
						</a>
						<a
							href={`/product/${product.slug}`}
							onClick={(e) => e.stopPropagation()}
							className='flex items-center justify-center w-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:-translate-y-1 active:translate-y-0'>
							<Eye className='h-5 w-5' />
						</a>
					</div>
				)}
			</div>

			{/* Hover pulse effect */}
			<div
				className={`absolute inset-0 rounded-2xl border-2 pointer-events-none ${
					isHovered
						? "border-purple-300/80 opacity-100"
						: "border-transparent opacity-0"
				} transition-all duration-500`}
			/>
		</div>
	);
};

export default ProductCard;
