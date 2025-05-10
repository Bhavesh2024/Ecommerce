"use client";
import { useRouter } from "next/navigation";
import React from "react";

const ProductCard = ({ product, showViewMore = true }) => {
	const getPriceValue = (price) => {
		if (typeof price === "object") {
			const firstKey = Object.keys(price)[0];
			return price[firstKey];
		}
		return price;
	};
	const router = useRouter();
	const singlePrice = getPriceValue(product?.price?.single);
	const couplePrice = getPriceValue(product?.price?.couple);

	return (
		<div
			className="max-w-xs bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-400"
			onClick={() => router.push(`/product/${product.id}`)}
		>
			<img
				src={`/images/product/${product.images[0]}`}
				alt={product.title}
				className="w-full h-56 object-cover"
			/>
			<div className="p-4">
				<h2 className="text-lg font-semibold text-gray-800 truncate">
					{product.title}
				</h2>
				<p className="text-sm text-gray-600 mt-1">
					{product.description.length > 50
						? `${product.description.slice(0, 50)}...`
						: product.description}
				</p>

				<div className="mt-2 flex justify-between items-center">
					<p className="text-sm text-gray-700">
						<span className="font-medium">Single:</span> ₹
						{singlePrice}
					</p>
					<p className="text-sm text-gray-700">
						<span className="font-medium">Couple:</span> ₹
						{couplePrice}
					</p>
				</div>

				{/* <p
					className={`text-sm font-semibold mt-2 ${
						product.stock === "In Stock"
							? "text-green-600"
							: "text-red-500"
					}`}
				>
					{product.stock}
				</p> */}
				{showViewMore && (
					<div className="flex justify-end items-center mt-3">
						<a
							href={`/product/${product.id}`}
							className="text-sm text-sky-600 hover:underline"
						>
							View More
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
