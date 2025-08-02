"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

const ProductNav = () => {
	const router = useRouter();

	return (
		<div className='w-full  px-5 md:px-10 min-h-[70px]  flex items-center justify-between gap-2 bg-slate-200 text-neutral-800 shadow-lg z-50'>
			<button
				onClick={() => router.back()}
				className='flex items-center  hover:underline'>
				<ArrowLeft className='size-6 text-slate-600' />
			</button>
			<button
				onClick={() => router.push("/")}
				className='flex items-center  hover:underline'>
				<Home className='size-6 text-slate-600' />
			</button>
		</div>
	);
};

export default ProductNav;
