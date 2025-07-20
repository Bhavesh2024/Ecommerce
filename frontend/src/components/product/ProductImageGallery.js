"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { generateOptimizedUrl } from "@/utils/helper/generator";

const ProductImageGallery = ({ images = [], thumbnail, name }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const nextImage = () => {
		setCurrentImageIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1,
		);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1,
		);
	};

	const currentImage = images?.[currentImageIndex]?.url || thumbnail;

	return (
		<motion.div
			layout
			className='bg-white rounded-2xl shadow-sm overflow-hidden'>
			<div className='relative aspect-square w-full h-60 overflow-hidden'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={currentImageIndex}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='absolute inset-0'>
						<Image
							src={generateOptimizedUrl(
								currentImage,
							)}
							alt={name}
							fill
							sizes='(max-width: 768px) 100vw, 600px'
							className='object-contain p-4'
						/>
					</motion.div>
				</AnimatePresence>

				{/* Navigation Arrows */}
				{images?.length > 1 && (
					<>
						<button
							onClick={prevImage}
							className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10'>
							<ChevronLeft className='h-5 w-5 text-gray-700' />
						</button>
						<button
							onClick={nextImage}
							className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md z-10'>
							<ChevronRight className='h-5 w-5 text-gray-700' />
						</button>
					</>
				)}

				{/* Dots Indicator */}
				{images?.length > 1 && (
					<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() =>
									setCurrentImageIndex(
										index,
									)
								}
								className={`w-2 h-2 rounded-full transition-all ${
									currentImageIndex ===
									index
										? "bg-purple-600 scale-125"
										: "bg-gray-300 hover:bg-gray-400"
								}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* Thumbnail Strip */}
			{images?.length > 1 && (
				<div className='p-4 border-t border-gray-100 grid grid-cols-4 gap-2'>
					{images.map((img, index) => (
						<motion.button
							key={index}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() =>
								setCurrentImageIndex(index)
							}
							className={`aspect-square border rounded-md overflow-hidden relative transition-all ${
								currentImageIndex === index
									? "ring-2 ring-purple-500 border-purple-500"
									: "border-gray-200 hover:border-gray-300"
							}`}>
							<Image
								src={generateOptimizedUrl(
									img.url,
								)}
								alt={
									img.label ||
									`Product view ${
										index + 1
									}`
								}
								fill
								sizes='(max-width: 768px) 100vw, 100px'
								className='object-cover'
							/>
						</motion.button>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default ProductImageGallery;
