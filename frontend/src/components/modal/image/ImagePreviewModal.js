"use client";
import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

export const ProductImageModal = ({ selectedImage, onClose }) => {
	if (!selectedImage) return null;

	return (
		<div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
			<button
				onClick={onClose}
				className='absolute top-4 right-4 text-white p-2'>
				<X className='w-6 h-6' />
			</button>
			<Image
				src={selectedImage}
				alt='Enlarged product view'
				width={800}
				height={800}
				className='max-h-full max-w-full object-contain'
			/>
		</div>
	);
};
