"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ShoppingCart,
	Image as GalleryImage,
	Package,
	PackagePlus,
	Share2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import { useAuth } from "@/hooks/useAuth";
import ProductNav from "@/layout/navbar/ProductNav";
import NotFound from "@/components/not-found/NotFound";
import PageLoader from "@/components/loader/PageLoader";
import dynamic from "next/dynamic";
import { ProductCardLoader } from "@/components/loader/CardLoader";
import {
	NoItemLoader,
	ProductAddonLoader,
} from "@/components/loader/ItemLoader";
import MessageLoader from "@/components/loader/MessageLoader";
import {
	PricingTableLoader,
	ProductImageGalleryLoader,
} from "@/components/loader/ProductLoader";
import { generateOptimizedUrl } from "@/utils/helper/generator";
import Image from "next/image";
import { categories } from "@/utils/helper/category";
const PricingTable = dynamic(() =>
	import("@/components/product/PricingTable", {
		ssr: true,
		loading: () => <PricingTableLoader />,
	}),
);
const ProductCard = dynamic(() => import("@/components/card/ProductCard"), {
	ssr: true,
	loading: () => <ProductCardLoader />,
});

const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: false,
	loading: () => <NoItemLoader />,
});

const Message = dynamic(() => import("@/components/popup/Message"), {
	ssr: false,
	loading: () => <MessageLoader />,
});

const ProductImageGallery = dynamic(
	() => import("@/components/product/ProductImageGallery"),
	{
		ssr: true,
		loading: () => <ProductImageGalleryLoader />,
	},
);

const ProductAddon = dynamic(
	() => import("@/components/product/ProductAddon"),
	{
		ssr: true,
		loading: () => <ProductAddonLoader />,
	},
);

const Page = () => {
	const { slug } = useParams();
	const router = useRouter();
	const { data, isSuccess, isError, isLoading } = useProduct(true, "all");
	const { isError: isAuthError } = useAuth();

	const [product, setProduct] = useState(null);
	const [related, setRelated] = useState([]);
	const [activeTab, setActiveTab] = useState("gallery");
	const [showMessage, setShowMessage] = useState(false);
	const [messageContent, setMessageContent] = useState({
		type: "success",
		message: "",
	});

	const tabs = [
		{
			id: "gallery",
			icon: <GalleryImage size={18} />,
			label: "Gallery",
		},
		{ id: "pricing", icon: <Package size={18} />, label: "Pricing" },
		{ id: "extras", icon: <PackagePlus size={18} />, label: "Extras" },
	];

	useEffect(() => {
		if (isSuccess && data?.products?.length) {
			const currentProduct = data.products.find(
				(p) => p.slug === slug,
			);
			setProduct(currentProduct);

			if (currentProduct) {
				const relatedProducts = data.products.filter(
					(p) =>
						p.category === currentProduct.category &&
						p.slug !== slug,
				);
				setRelated(relatedProducts);
			}
		}
	}, [isSuccess, data, slug]);

	useEffect(() => {
		if (showMessage) {
			setTimeout(() => {
				setShowMessage(false);
			}, 3000);
		}
	}, [showMessage]);

	const handleShare = () => {
		const shareData = {
			title: product.name,
			url: `${window.location.origin}/product/${slug}`,
		};

		if (navigator.share) {
			navigator.share(shareData);
		} else {
			navigator.clipboard.writeText(shareData.url);
			setMessageContent({
				type: "success",
				message: "Link copied to clipboard!",
			});
			setShowMessage(true);
		}
	};

	const handleOrder = () => {
		if (isAuthError) {
			setMessageContent({
				type: "error",
				message: "Please login to continue",
			});
			setShowMessage(true);
		} else {
			router.push(`/product/${slug}/checkout`);
		}
	};

	return (
		<>
			{isLoading && (
				<div className='min-h-[60vh]'>
					<PageLoader />
				</div>
			)}
			{isError ||
				(!isLoading && isSuccess && !product && <NotFound />)}
			{isSuccess && product && (
				<div className='bg-gray-50 min-h-screen'>
					<ProductNav />

					{/* Main Content */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
						className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
						{/* Product Grid */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
							<ProductImageGallery
								name={product.name}
								images={product.images}
								thumbnail={product.thumbnail}
							/>
							{/* Product Details */}
							<motion.div
								layout
								className='space-y-6'>
								{/* Title and Category */}
								<div>
									<motion.h1
										initial={{
											y: -10,
											opacity: 0,
										}}
										animate={{
											y: 0,
											opacity: 1,
										}}
										transition={{
											delay: 0.1,
										}}
										className='text-3xl font-bold text-gray-900'>
										{product.name}
									</motion.h1>
									<motion.div
										initial={{
											y: -10,
											opacity: 0,
										}}
										animate={{
											y: 0,
											opacity: 1,
										}}
										transition={{
											delay: 0.15,
										}}
										className='mt-2 flex gap-2 items-center'>
										<span className='px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
											{categories[
												product
													.category
											] ||
												product.category}
										</span>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${
												product.stockStatus
													? "text-emerald-800 bg-emerald-100"
													: "text-red-800 bg-red-100"
											}`}>
											{product.stockStatus
												? "In Stock"
												: "Out of Stock"}
										</span>
									</motion.div>
								</div>

								{/* Price Section */}
								<motion.div
									initial={{
										y: -10,
										opacity: 0,
									}}
									animate={{
										y: 0,
										opacity: 1,
									}}
									transition={{
										delay: 0.2,
									}}
									className='space-y-2'>
									<div className='flex items-center gap-4'>
										<span className='text-3xl font-bold text-purple-700'>
											₹
											{(
												product.price -
												product.price *
													(product.discount /
														100)
											).toFixed(2)}
										</span>
										{product.discount >
											0 && (
											<>
												<span className='text-lg text-gray-500 line-through'>
													₹
													{
														product.price
													}
												</span>
												<span className='px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded'>
													{
														product.discount
													}
													%
													OFF
												</span>
											</>
										)}
									</div>
								</motion.div>

								{/* Description */}
								<motion.div
									initial={{
										y: -10,
										opacity: 0,
									}}
									animate={{
										y: 0,
										opacity: 1,
									}}
									transition={{
										delay: 0.25,
									}}
									className='prose text-gray-600'>
									<p>
										{
											product.description
										}
									</p>
								</motion.div>

								{/* Action Buttons */}
								<motion.div
									initial={{
										y: -10,
										opacity: 0,
									}}
									animate={{
										y: 0,
										opacity: 1,
									}}
									transition={{
										delay: 0.35,
									}}
									className='flex flex-wrap gap-3 pt-4'>
									<motion.button
										whileHover={
											product.stockStatus
												? {
														scale: 1.02,
												  }
												: {}
										}
										whileTap={
											product.stockStatus
												? {
														scale: 0.98,
												  }
												: {}
										}
										onClick={
											handleOrder
										}
										disabled={
											!product.stockStatus
										}
										className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
											product.stockStatus
												? "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg"
												: "bg-gray-300 text-gray-500 cursor-not-allowed"
										}`}>
										<ShoppingCart className='h-5 w-5' />
										{product.stockStatus
											? "Order Now"
											: "Unavailable"}
									</motion.button>

									<motion.button
										whileHover={{
											scale: 1.02,
										}}
										whileTap={{
											scale: 0.98,
										}}
										onClick={
											handleShare
										}
										className='flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors'>
										<Share2 className='h-5 w-5' />
										Share
									</motion.button>
								</motion.div>
							</motion.div>
						</div>

						{/* Product Tabs */}
						<motion.div
							layout
							className='mt-12 bg-white rounded-2xl shadow-sm overflow-hidden'>
							{/* Tab Headers */}
							<div className='border-b border-gray-200 overflow-x-auto overflow-y-hidden'>
								<nav className='flex -mb-px'>
									{tabs.map((tab) => (
										<motion.button
											key={tab.id}
											whileHover={{
												backgroundColor:
													"#f3f4f6",
											}}
											onClick={() =>
												setActiveTab(
													tab.id,
												)
											}
											className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
												activeTab ===
												tab.id
													? "border-purple-500 text-purple-600"
													: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
											}`}>
											{tab.icon}
											{tab.label}
										</motion.button>
									))}
								</nav>
							</div>

							{/* Tab Content */}
							<div className='p-6'>
								<AnimatePresence mode='wait'>
									<motion.div
										key={activeTab}
										initial={{
											opacity: 0,
											y: 10,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											y: -10,
										}}
										transition={{
											duration: 0.2,
										}}>
										{/* Gallery Tab */}
										{activeTab ===
											"gallery" && (
											<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
												{product
													.images
													?.length >
												0 ? (
													product.images.map(
														(
															img,
															index,
														) => (
															<motion.div
																key={
																	index
																}
																whileHover={{
																	scale: 1.02,
																}}
																className='group relative aspect-square overflow-hidden rounded-lg border border-gray-200'>
																<Image
																	src={generateOptimizedUrl(
																		img.url,
																	)}
																	alt={
																		img.label ||
																		`Product view ${
																			index +
																			1
																		}`
																	}
																	fill
																	sizes='(max-width: 768px) 100vw, 100px'
																	className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
																/>

																{img.label && (
																	<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2'>
																		<p className='text-xs text-white truncate'>
																			{
																				img.label
																			}
																		</p>
																	</div>
																)}
															</motion.div>
														),
													)
												) : (
													<NoItem
														icon={
															<GalleryImage className='h-12 w-12 text-gray-400' />
														}
														message='No additional images available'
														className='col-span-full py-12'
													/>
												)}
											</div>
										)}

										{/* Pricing Tab */}
										{activeTab ===
											"pricing" && (
											<div className='overflow-x-auto'>
												{product
													.prices
													?.length >
												0 ? (
													product.prices.map(
														(
															group,
															index,
														) => (
															<PricingTable
																type={
																	group.type
																}
																discount={
																	product.discount
																}
																variants={
																	group.variants
																}
																index={
																	index
																}
															/>
														),
													)
												) : (
													<NoItem
														icon={
															<Package className='h-12 w-12 text-gray-400' />
														}
														message='No pricing variants available'
														className='py-12'
													/>
												)}
											</div>
										)}

										{/* Extras Tab */}
										{activeTab ===
											"extras" && (
											<div>
												{product
													.extras
													?.length >
												0 ? (
													<div className='space-y-4'>
														{product.extras.map(
															(
																{
																	name,
																	price,
																},
																index,
															) => (
																<ProductAddon
																	name={
																		name
																	}
																	price={
																		price
																	}
																	index={
																		index
																	}
																/>
															),
														)}
													</div>
												) : (
													<NoItem
														icon={
															<PackagePlus className='h-12 w-12 text-gray-400' />
														}
														message='No add-ons available'
														className='py-12'
													/>
												)}
											</div>
										)}
									</motion.div>
								</AnimatePresence>
							</div>
						</motion.div>

						{/* Related Products */}
						{related.length > 0 && (
							<motion.section
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className='mt-16'>
								<div className='flex justify-between items-center mb-6'>
									<h2 className='text-xl font-bold text-gray-900'>
										You may also like
									</h2>
								</div>

								<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-72 w-full'>
									{related.map((p) => (
										<div
											key={p.id}
											className='px-2 size-72 max-h-60'>
											<ProductCard
												product={
													p
												}
											/>
										</div>
									))}
								</div>
								{/* </Slider> */}
							</motion.section>
						)}
					</motion.div>

					{/* Notification Message */}
					{showMessage && (
						<Message
							type={"error"}
							message={messageContent.message}
							onClose={() => setShowMessage(false)}
							position='fixed flex top-20 mx-10 md:start-1/5 lg:start-2/5 px-4 !w-4/5 md:!w-2/4 lg:!w-1/4'
						/>
					)}
				</div>
			)}
		</>
	);
};

export default Page;
