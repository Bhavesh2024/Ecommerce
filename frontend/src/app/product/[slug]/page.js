"use client";

import React from "react";
import ProductNav from "@/layout/navbar/ProductNav";
import { products } from "@/utils/product";
import ProductCard from "@/components/card/ProductCard";
import { useParams } from "next/navigation";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const page = () => {
	const { slug } = useParams();
	const product = products.find((item) => item.id === slug);
	const otherProducts = products.filter((item) => item.id !== slug);

	if (!product)
		return <div className="p-4 text-center">Product not found.</div>;

	const sliderSettings = {
		autoplay: true,
		autoplaySpeed: 2000,
		infinite: true,
		slidesToShow: 5,
		slidesToScroll: 1,
		responsive: [
			{ breakpoint: 1024, settings: { slidesToShow: 2 } },
			{ breakpoint: 640, settings: { slidesToShow: 1 } },
		],
	};

	return (
		<>
			<ProductNav />
			<div className="p-4 mx-auto container">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="w-full md:w-1/2">
						<Image
							src={`/images/product/${product.images[0]}`}
							alt={product.title}
							width={600}
							height={400}
							className="rounded-lg object-fill w-full h-96"
						/>
					</div>
					<div className="w-full md:w-1/2 flex flex-col ">
						<h1 className="text-2xl font-bold text-gray-800 mb-2">
							{product.title}
						</h1>
						<p className="text-sm text-gray-600 mb-2">
							Category: {product.category}
						</p>
						<p className="text-gray-700 mb-4">
							{product.description}
						</p>
						{typeof product.price.single !== "object" && (
							<p className="text-lg font-semibold text-green-700 mb-2">
								Price: ₹{product.price.single}
							</p>
						)}
						<ul className="text-sm text-gray-700 mb-4">
							{product.extras.map((extra) => (
								<li key={extra.name}>
									{extra.name}: ₹{extra.price}
								</li>
							))}
						</ul>

						<div className="flex gap-4 mb-4">
							<button
								className={`text-sm font-semibold min-w-28 max-w-fit text-white rounded ${
									product.stock === "In Stock"
										? "bg-green-600  hover:bg-green-700"
										: "bg-red-500  hover:bg-red-700"
								}`}
							>
								{product.stock}
							</button>
							{/* <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
								Add to Cart
							</button> */}
							<button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-green-700">
								Buy Now
							</button>
						</div>
					</div>
				</div>
				{typeof product.price.single === "object" && (
					<div className="mt-8">
						<h3 className="text-lg font-semibold mb-2">
							Price Table
						</h3>
						<table className="w-full border text-sm">
							<thead className="bg-sky-100">
								<tr>
									<th className="p-2 border">Size</th>
									<th className="p-2 border">Single</th>
									<th className="p-2 border">Couple</th>
								</tr>
							</thead>
							<tbody>
								{Object.keys(product.price.single).map(
									(size) => (
										<tr key={size} className="text-center">
											<td className="p-2 border">
												{size}
											</td>
											<td className="p-2 border">
												₹{product.price.single[size]}
											</td>
											<td className="p-2 border">
												₹{product.price.couple[size]}
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				)}

				{/* Related Products Slider */}
				<div className="mt-10">
					<h2 className="text-xl font-semibold mb-4">
						Explore More Gifts
					</h2>
					<Slider {...sliderSettings}>
						{otherProducts.map((p) => (
							<div key={p.id} className="px-2">
								<ProductCard product={p} showViewMore={false} />
							</div>
						))}
					</Slider>
				</div>
			</div>
		</>
	);
};

export default page;
