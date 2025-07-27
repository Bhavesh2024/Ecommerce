import { categoryIcons } from "@/utils/helper/web-content";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = () => {
	return (
		<>
			<section className='mt-16 relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
				{/* Background with subtle texture */}
				<div className='absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100'>
					<div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2Zy...')]"></div>
				</div>

				{/* Floating art elements */}
				<div className='absolute top-20 right-20 w-32 h-32 rounded-full bg-purple-200 opacity-20 mix-blend-multiply'></div>
				<div className='absolute bottom-1/4 left-20 w-40 h-40 rotate-45 bg-purple-300 opacity-10 mix-blend-multiply'></div>
				<div className='absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-purple-400 opacity-15 mix-blend-multiply'></div>

				{/* Main Content */}
				<div className='relative max-w-5xl mx-auto px-6 text-center z-10 p-4 mt-5'>
					<div className='inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6 border border-purple-200'>
						<Sparkles className='w-4 h-4 mr-2' />
						<span className='text-sm font-medium'>
							Upsquare Art & Design
						</span>
					</div>

					<h1 className='text-xl text-wrap max-w-[80%] text-center mx-auto md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
						Bring{" "}
						<span className='text-purple-600'>
							Meaningful Art
						</span>{" "}
						Into Your Life
					</h1>

					<p className='md:text-xl max-w-[80%] text-wrap text-gray-600 mb-10 md:max-w-2xl mx-auto leading-relaxed'>
						Explore handcrafted wooden art, expressive
						jewellery, and matching couple wear — all
						made with care, creativity, and a touch of
						soul.
					</p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center px-4 max-w-[90%] mx-auto'>
						<Link
							href={"/products"}
							className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl'>
							Browse Collection
						</Link>
						<Link
							href={"/contact"}
							className='bg-white hover:bg-gray-50 text-purple-700 border-2 border-purple-200 px-8 py-4 rounded-lg font-medium transition-all shadow-sm hover:shadow-md'>
							Connect with Us
						</Link>
					</div>

					<div className='mt-16 flex justify-center gap-8 opacity-80 flex-wrap'>
						{categoryIcons.map((Icon, i) => (
							<div
								key={i}
								className='bg-white/80 p-3 rounded-full shadow-sm'>
								<Icon className='w-6 h-6 text-purple-600' />
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
