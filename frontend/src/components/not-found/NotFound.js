"use client";

import React from "react";

const NotFound = () => {
	return (
		<>
			<div className='w-full min-h-screen flex flex-col lg:flex-row items-center justify-center lg:space-y-0 space-x-8 2xl:space-x-0 overflow-hidden'>
				<div className='w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center'>
					<p className='text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-gray-300'>
						404
					</p>
					<p className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-gray-300'>
						Page Not Found
					</p>
					<p className='text-base md:text-lg lg:text-xl text-gray-500 my-8'>
						Sorry, the page you are looking for could
						not be found.
					</p>
					<a
						href='/'
						className='flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-gray-100 px-4 py-2 rounded transition duration-150'
						title='Return Home'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
							viewBox='0 0 20 20'
							fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z'
								clipRule='evenodd'
							/>
						</svg>
						<span>Return Home</span>
					</a>
				</div>

				<div className='w-full lg:w-1/2 flex justify-center items-center p-4'>
					<img
						src={"/images/error/shopping.svg"}
						alt='Not Found Illustration'
						className='max-h-[600px] w-auto object-contain'
					/>
				</div>
			</div>
		</>
	);
};

export default NotFound;
