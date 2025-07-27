"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import PageLoader from "@/components/loader/PageLoader";
import NoItem from "@/components/not-found/NoItem";
import { useProduct } from "@/hooks/useProduct";
import Navbar from "@/layout/navbar/Navbar";
import { Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { categoryIcons } from "@/utils/helper/web-content";
import { ProductCardLoader } from "@/components/loader/CardLoader";

// Dynamically import ProductCard with loading fallback
const ProductCard = dynamic(() => import("@/components/card/ProductCard"), {
	loading: () => <ProductCardLoader />,
	ssr: true,
});

// ProductGrid component with animations
const ProductGrid = ({ products }) => {
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<motion.div
			variants={container}
			initial='hidden'
			animate='show'
			className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
			{products.map((product) => (
				<motion.div
					key={product.id}
					variants={item}>
					<ProductCard product={product} />
				</motion.div>
			))}
		</motion.div>
	);
};

const ProductPage = () => {
	const { data, isSuccess, isLoading, isError } = useProduct(true, "all");
	const [products, setProducts] = useState([]);

	useEffect(() => {
		if (isSuccess && data) {
			const { products } = data;
			setProducts(products);
		}
	}, [data, isSuccess]);

	return (
		<>
			<div className='fixed top-0 left-0 w-full z-50'>
				<Navbar />
			</div>

			<div className='min-h-[60vh] pt-24 pb-12'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Header with Category Icons */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='mb-8'>
						<div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6'>
							<div>
								<h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>
									Our Creative Collection
								</h1>
								<p className='text-gray-600'>
									Discover {products.length}{" "}
									unique artistic products
								</p>
							</div>

							<div className='flex items-center gap-1'>
								<span className='text-sm text-gray-500 mr-2 hidden sm:block'>
									Categories:
								</span>
								<div className='flex gap-2'>
									{categoryIcons.map(
										(Icon, i) => (
											<motion.div
												key={i}
												whileHover={{
													y: -2,
													scale: 1.05,
												}}
												whileTap={{
													scale: 0.95,
												}}
												className='bg-white p-3 rounded-full shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer'>
												<Icon className='w-5 h-5 text-purple-600' />
											</motion.div>
										),
									)}
								</div>
							</div>
						</div>

						<div className='w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent'></div>
					</motion.div>

					{/* --- Conditional Content Rendering --- */}

					{isLoading && <PageLoader />}

					{isError && (
						<NoItem
							icon={
								<Package className='size-20 text-slate-500' />
							}
							message='No Products Found'
						/>
					)}

					{isSuccess && products.length > 0 && (
						<ProductGrid products={products} />
					)}

					{isSuccess && products.length === 0 && (
						<NoItem
							icon={<Package />}
							message='No products available right now.'
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ProductPage;
