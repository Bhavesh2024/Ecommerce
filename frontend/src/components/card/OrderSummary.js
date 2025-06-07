"use client";
import { X } from "lucide-react";
import React from "react";
const OrderSummary = ({
	order,
	isActivate = true,
	closePopup,
	hideClose = false,
}) => {
	if (!order)
		return <div className='text-gray-500'>No order selected.</div>;

	const { orderId, orderItem, product, total } = order;
	const groupedVariants = {};
	orderItem?.variants?.forEach((variant) => {
		let matchedType = "Unknown Type";
		for (const priceType of product?.prices || []) {
			const found = priceType.variants.find(
				(pv) =>
					pv.sku === variant.sku &&
					pv.label === variant.label &&
					pv.value === variant.value,
			);
			if (found) {
				matchedType = priceType.type;
				break;
			}
		}
		if (!groupedVariants[matchedType]) {
			groupedVariants[matchedType] = [];
		}
		groupedVariants[matchedType].push(variant);
	});

	return (
		<div
			className={`w-full h-full mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6 md:block relative border border-slate-200 `}>
			{!hideClose && (
				<X
					className='size-5 text-slate-500 absolute top-2 end-2 md:hidden'
					onClick={closePopup}
				/>
			)}
			{/* Header */}
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-semibold text-gray-800'>
					{product?.name}
				</h2>
				<span className='text-xs text-slate-400 font-medium'>
					#{orderId}
				</span>
			</div>

			{/* Variant Groups */}
			{Object.entries(groupedVariants).map(
				([type, variants], idx) => (
					<div
						key={idx}
						className='mb-3'>
						<p className='text-gray-500 text-sm mb-1 font-medium'>
							{type}
						</p>
						<ul className='list-inside text-sm text-gray-700 space-y-1'>
							{variants.map((v, i) => (
								<li
									key={i}
									className='flex justify-between'>
									<span>
										{v.label}
										<span className='text-xs text-gray-400'>
											{" "}
											({v.quantity}
											×)
										</span>
									</span>
									<span>₹{v.value}</span>
								</li>
							))}
						</ul>
					</div>
				),
			)}

			{/* Extras */}
			{orderItem?.extras?.length > 0 && (
				<div>
					<h3 className='font-medium text-gray-800 mb-1'>
						Extras
					</h3>
					<ul className='text-sm text-gray-700 list-disc list-inside space-y-1'>
						{orderItem.extras.map((extra, index) => (
							<li
								key={index}
								className='flex justify-between'>
								<span>{extra.name}</span>
								<span>₹{extra.price}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Totals */}
			<div className='border-t pt-3 text-sm text-gray-700 space-y-1'>
				<div className='flex justify-between'>
					<span className='font-medium'>Subtotal</span>
					<span>
						₹
						{orderItem?.totals?.variantTotal?.toFixed(
							2,
						)}
					</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-medium'>Extras</span>
					<span>
						₹
						{orderItem?.totals?.extrasTotal?.toFixed(2)}
					</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-medium'>Discount</span>
					<span>
						₹
						{orderItem?.totals?.discountAmount?.toFixed(
							2,
						)}
					</span>
				</div>
				<div className='flex justify-between'>
					<span className='font-medium'>Quantity</span>
					<span>
						{orderItem?.totals?.totalUnits?.toFixed(2)}
					</span>
				</div>
			</div>

			{/* Final Total */}
			<div className='flex justify-between border-t pt-3'>
				<span className='font-semibold'>Total</span>
				<span className='font-bold text-lg'>
					₹{total?.toFixed(2)}
				</span>
			</div>
		</div>
	);
};

export default OrderSummary;
