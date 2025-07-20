"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";

const PageLoader = ({ component }) => {
	return (
		<>
			{component ? (
				component
			) : (
				<div className='flex items-center justify-center min-h-[50vh] h-full w-full min-w-[300px] '>
					<LoaderCircle className='size-10 text-purple-700 animate-spin' />
				</div>
			)}
		</>
	);
};

export default PageLoader;
