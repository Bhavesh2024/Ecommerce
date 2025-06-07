"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";

const PageLoader = ({ component }) => {
	return (
		<>
			{component ? (
				component
			) : (
				<div className='flex items-center justify-center h-screen w-full '>
					<LoaderCircle className='size-20 text-blue-500 animate-spin' />
				</div>
			)}
		</>
	);
};

export default PageLoader;
