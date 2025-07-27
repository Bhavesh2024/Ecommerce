"use client";
import React, { useState } from "react";
import Image from "next/image";
export const ProductImageThumbnail = ({
	src,
	alt,
	label,
	isFeatured = false,
	onClick,
}) => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div
			className={`relative rounded-md overflow-hidden bg-gray-100 aspect-square ${
				isFeatured
					? "border-2 border-purple-700"
					: "border border-gray-200"
			} cursor-pointer`}
			onClick={onClick}>
			<Image
				src={src}
				alt={alt}
				width={200}
				height={200}
				className={`w-full h-full object-cover transition-opacity ${
					isLoading ? "opacity-0" : "opacity-100"
				}`}
				onLoadingComplete={() => setIsLoading(false)}
			/>
			{isLoading && (
				<div className='absolute inset-0 bg-gray-200 animate-pulse' />
			)}
			{label && (
				<div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center truncate'>
					{label}
				</div>
			)}
		</div>
	);
};
