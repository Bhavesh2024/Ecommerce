"use client";

import React, { useEffect, useState } from "react";
import ProductNav from "@/layout/navbar/ProductNav";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProduct } from "@/hooks/useProduct";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import ProductCard from "@/components/card/ProductCard";
import { useAuth } from "@/hooks/useAuth";

const Page = () => {
	const { slug } = useParams();
	const { data, isSuccess, isError, isLoading } = useProduct(true, "all");
	const { isError: isAuthError } = useAuth();
	const router = useRouter();

	const [product, setProduct] = useState(null);
	const [related, setRelated] = useState([]);

	const sliderSettings = {
		autoplay: true,
		autoplaySpeed: 2000,
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{ breakpoint: 1024, settings: { slidesToShow: 2 } },
			{ breakpoint: 640, settings: { slidesToShow: 1 } },
		],
	};

	// Set product when data is loaded
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

	if (isLoading) return <PageLoader />;
	if (isError || !product) return <NotFound />;
	if (product && !product.status) return <NotFound />;

	const imageUrl = product.thumbnail || product.images?.[0]?.url;
	// const { user } = useCustomerStoreState();
	// console.log(user);
	return (
		<>
			<div className='fixed top-0 left-0 w-full'>
				<ProductNav />
			</div>
			<div className='p-4 mx-auto w-full md:w-3/4 mt-16'>
				{/* Main Product Section */}
				<div className='flex flex-col md:flex-row gap-6'>
					{/* Image */}
					<div className='w-full md:w-1/3'>
						<Image
							src={imageUrl}
							alt={product.title}
							width={400}
							height={300}
							className='rounded-lg object-fill w-full h-96'
							unoptimized
						/>
					</div>

					{/* Details */}
					<div className='w-full md:w-1/2 flex flex-col'>
						<h1 className='text-2xl font-bold text-gray-800 mb-2'>
							{product.title}
						</h1>

						<div className='flex flex-col mb-2'>
							<span className='text-xs text-gray-500'>
								Category
							</span>
							<span className='text-slate-700 font-semibold'>
								{product.category}
							</span>
						</div>

						<p className='flex flex-col my-2'>
							<span className='text-xs text-gray-500'>
								Description
							</span>
							<span className='text-slate-700 text-sm'>
								{product.description}
							</span>
						</p>

						{/* Additional Images */}
						{Array.isArray(product.images) &&
							product.images.length > 0 && (
								<div className='flex gap-3 flex-wrap mt-2'>
									{product.images
										.filter(
											(image) =>
												image.url !==
												product.thumbnail,
										)
										.map(
											(
												{
													url,
													label,
												},
												index,
											) => (
												<div
													key={`image${index}`}
													className='flex flex-col gap-1 items-center border border-slate-400 rounded-md'>
													<img
														src={
															url
														}
														title={
															label
														}
														className='h-32 w-36 object-fill rounded-t-md'
														alt={
															label
														}
													/>
													<span className='text-xs text-gray-400 py-1 px-2'>
														{
															label
														}
													</span>
												</div>
											),
										)}
								</div>
							)}

						{/* Stock & Order Button */}
						<div className='flex gap-4 mb-4 mt-4'>
							<button
								className={`text-sm font-semibold min-w-28 px-4 py-2 text-white rounded ${
									product.stockStatus
										? "bg-green-600 hover:bg-green-700"
										: "bg-red-500 hover:bg-red-700"
								}`}>
								{product.stockStatus
									? "In Stock"
									: "Out of Stock"}
							</button>
							<button
								className='bg-teal-600 text-white px-4 py-2 rounded hover:bg-green-700'
								onClick={() =>
									isAuthError
										? alert(
												"You are not login yet",
										  )
										: router.push(
												`/product/${slug}/checkout`,
										  )
								}>
								Order Now
							</button>
						</div>
					</div>
				</div>

				{/* Variant Table */}
				{product.prices?.length > 0 && (
					<div className='mt-10'>
						<h3 className='text-lg font-semibold mb-2'>
							Pricing
						</h3>
						{product.prices.map((group, index) => (
							<div
								key={`${group.type}-${index}`}
								className='mb-6'>
								<table className='w-full border text-sm'>
									<thead className='bg-sky-100'>
										<tr>
											<th className='p-2 border'>
												#
											</th>
											<th className='p-2 border'>
												{
													group.type
												}
											</th>
											<th className='p-2 border'>
												Price
												(₹)
											</th>
											{product.discount >
												0 && (
												<>
													<th className='p-2 border'>
														Discount
													</th>
													<th className='p-2 border'>
														Total
													</th>
												</>
											)}
										</tr>
									</thead>
									<tbody>
										{group.variants.map(
											(
												variant,
												idx,
											) => {
												const discount =
													product.discount ||
													0;
												const price =
													variant.value;
												const discountedPrice =
													Math.round(
														(price *
															discount) /
															100,
													);
												const discountedTotal =
													discount >
													0
														? Math.round(
																price -
																	(price *
																		discount) /
																		100,
														  )
														: price;

												return (
													<tr
														key={
															variant.sku
														}
														className='text-center'>
														<td className='p-2 border'>
															{idx +
																1}
														</td>
														<td className='p-2 border'>
															{
																variant.label
															}
														</td>
														<td className='p-2 border'>
															₹
															{
																price
															}
														</td>
														{discount >
															0 && (
															<>
																<td className='p-2 border'>
																	₹
																	{
																		discountedPrice
																	}
																</td>
																<td className='p-2 border'>
																	₹
																	{
																		discountedTotal
																	}
																</td>
															</>
														)}
													</tr>
												);
											},
										)}
									</tbody>
								</table>
							</div>
						))}
					</div>
				)}

				{/* Extras Section */}
				{product.extras?.length > 0 && (
					<div className='mt-6'>
						<h3 className='text-lg font-semibold mb-2'>
							Extras
						</h3>
						<ul className='list-disc list-inside text-sm text-gray-700'>
							{product.extras.map((extra, idx) => (
								<li
									key={idx}
									className='my-2'>
									<span className='font-medium'>
										{extra.name} :
									</span>{" "}
									₹{extra.price}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Related Products */}
				{related.length > 0 && (
					<div className='mt-12'>
						<h2 className='text-xl font-semibold mb-4'>
							Explore More Products
						</h2>

						{related.length > 5 ? (
							<Slider {...sliderSettings}>
								{related.map((p) => (
									<div
										key={p.id}
										className='px-2'>
										<ProductCard
											product={p}
											showViewMore={
												false
											}
										/>
									</div>
								))}
							</Slider>
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
								{related.map((p) => (
									<ProductCard
										key={p.id}
										product={p}
										showViewMore={false}
									/>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
