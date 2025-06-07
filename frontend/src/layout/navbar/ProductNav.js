"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

const ProductNav = () => {
	const router = useRouter();

	return (
		<div className='w-full bg-neutral-800 px-5 md:px-10 min-h-[70px] border-b flex items-center justify-between gap-2'>
			<button
				onClick={() => router.back()}
				className='flex items-center text-white hover:underline'>
				<ArrowLeft className='size-6' />
			</button>
			<button
				onClick={() => router.push("/")}
				className='flex items-center  text-white hover:underline'>
				<Home className='size-6' />
			</button>
		</div>
	);
};

export default ProductNav;
