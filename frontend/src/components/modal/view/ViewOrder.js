"use client";

import React from "react";
import {
	ArrowLeft,
	Mail,
	Phone,
	User,
	MapPin,
	Tag,
	Package,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { paymentStatuses, orderStatuses } from "@/utils/helper/status";
import OrderSummary from "@/components/card/OrderSummary";

const Section = ({ title, children }) => (
	<div className='mb-6 bg-white border rounded-xl shadow-sm'>
		<h3 className='bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-700 rounded-t-xl border-b'>
			{title}
		</h3>
		<div className='px-5 py-4 text-sm'>{children}</div>
	</div>
);

const StatusPill = ({ value, list }) => {
	const match = list.find((s) => s.value === value);
	return match ? (
		<span
			className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${match.bg} ${match.text}`}>
			{match.label}
		</span>
	) : null;
};

const InfoItem = ({ icon: Icon, label, value }) => (
	<div className='flex items-center gap-3 py-2'>
		<Icon className='w-5 h-5 mt-1 text-gray-500' />
		<div>
			<div className='text-gray-500 text-xs'>{label}</div>
			<div className='text-neutral-800 text-sm '>{value}</div>
		</div>
	</div>
);

const ViewOrder = ({ data }) => {
	const router = useRouter();
	const {
		orderItem,
		product,
		user,
		address,
		orderId,
		paymentStatus,
		orderStatus,
	} = data;

	const {
		variantType,
		variantPrice,
		quantity,
		extras = [],
		totals,
	} = orderItem;

	return (
		<>
			<div className='flex flex-col gap-2 w-full md:h-[80vh] justify-center p-4 mt-4'>
				<div className='flex justify-between items-center px-3 w-full md:w-11/12 xl:w-4/5 mx-auto border border-slate-200 rounded-md shadow h-12 py-3 md:py-0'>
					<button
						onClick={() => router.back()}
						title='Back'>
						<ArrowLeft className='text-gray-600 hover:text-red-500 w-5 h-5' />
					</button>
					{/* <span className='text-xs font-semibold text-gray-400'>
						Order ID: {orderId}
					</span> */}
					<h1 className='font-semibold'>Order Summary</h1>
				</div>
				<div className='flex flex-col h-full mx-auto md:flex-row gap-2 w-full md:w-11/12 xl:w-4/5'>
					<div className='h-full border border-slate-200 md:w-1/4 rounded-md shadow flex flex-col gap-2 p-2'>
						{/* Product Info with Image, Product Name */}
						<div className='flex flex-col items-center'>
							<img
								src={product.thumbnail}
								className='h-32 w-36 rounded shadow'
							/>
							<div className=' font-semibold text-gray-800'>
								{product.name}
							</div>
						</div>
						<div className='w-full'>
							<InfoItem
								icon={User}
								label='Name'
								value={user.name}
							/>
							<InfoItem
								icon={Mail}
								label='Email'
								value={user.email}
							/>
							<InfoItem
								icon={Phone}
								label='Phone'
								value={user.phone}
							/>
							<InfoItem
								icon={MapPin}
								label='Shipping Address'
								value={address}
							/>
						</div>
						{/* Customer Info with Name,Email,Phone,Address */}
						{/* Order Statuses Payment and Delivery Status */}
						<div className='flex flex-col gap-2 items-center flex-wrap'>
							<div className='flex justify-between items-center w-full'>
								<div className='text-xs text-gray-500 mb-1'>
									Order Status
								</div>
								<StatusPill
									value={orderStatus}
									list={orderStatuses}
								/>
							</div>
							<div className='flex justify-between items-center w-full'>
								<div className='text-xs text-gray-500 mb-1'>
									Payment Status
								</div>
								<StatusPill
									value={paymentStatus}
									list={paymentStatuses}
								/>
							</div>
						</div>
					</div>
					<div className='h-full  md:w-4/5 border-none'>
						<OrderSummary
							order={data}
							hideClose={true}
						/>
					</div>
				</div>
			</div>
		</>
		// <div className='max-w-5xl mx-auto px-4 sm:px-8 py-6'>
		// 	{/* Topbar */}
		// 	<div className='flex justify-between items-center mb-6'>
		// 		<button
		// 			onClick={() => router.back()}
		// 			title='Back'>
		// 			<ArrowLeft className='text-gray-600 hover:text-red-500 w-5 h-5' />
		// 		</button>
		// 		<h1 className='text-lg font-semibold text-gray-800'>
		// 			Order ID: {orderId}
		// 		</h1>
		// 	</div>

		// 	{/* Product Summary */}
		// 	<Section title='Product Ordered'>
		// 		<div className='flex flex-col sm:flex-row items-start gap-4'>
		// 			<img
		// 				src={product.thumbnail}
		// 				alt={product.name}
		// 				className='w-24 h-24 rounded-md object-cover border'
		// 			/>
		// 			<div className='flex-1'>
		// 				<div className='text-lg font-semibold text-gray-800'>
		// 					{product.name}
		// 				</div>
		// 				<div className='text-sm text-gray-600 mt-1'>
		// 					Quantity:{" "}
		// 					<span className='font-medium text-gray-800'>
		// 						{quantity}
		// 					</span>
		// 				</div>
		// 				{variantType && (
		// 					<div className='text-sm text-gray-600'>
		// 						Variant:{" "}
		// 						<span className='text-gray-800 font-medium'>
		// 							{variantType}
		// 						</span>{" "}
		// 						- ₹{variantPrice}
		// 					</div>
		// 				)}
		// 				{extras.length > 0 && (
		// 					<div className='text-sm mt-2'>
		// 						<span className='text-gray-700 font-semibold'>
		// 							Add-ons:
		// 						</span>
		// 						<ul className='list-disc list-inside mt-1 text-gray-700'>
		// 							{extras.map(
		// 								(extra, i) => (
		// 									<li key={i}>
		// 										{
		// 											extra.label
		// 										}{" "}
		// 										— ₹
		// 										{
		// 											extra.price
		// 										}
		// 									</li>
		// 								),
		// 							)}
		// 						</ul>
		// 					</div>
		// 				)}
		// 			</div>
		// 		</div>
		// 	</Section>

		// 	{/* Order Status */}
		// 	<Section title='Order Status'>
		// 		<div className='flex gap-6 items-center flex-wrap'>
		// 			<div>
		// 				<div className='text-xs text-gray-500 mb-1'>
		// 					Order Status
		// 				</div>
		// 				<StatusPill
		// 					value={orderStatus}
		// 					list={orderStatuses}
		// 				/>
		// 			</div>
		// 			<div>
		// 				<div className='text-xs text-gray-500 mb-1'>
		// 					Payment Status
		// 				</div>
		// 				<StatusPill
		// 					value={paymentStatus}
		// 					list={paymentStatuses}
		// 				/>
		// 			</div>
		// 		</div>
		// 	</Section>

		// 	{/* Customer Info */}
		// 	<Section title='Customer Information'>
		// 		<InfoItem
		// 			icon={User}
		// 			label='Name'
		// 			value={user.name}
		// 		/>
		// 		<InfoItem
		// 			icon={Mail}
		// 			label='Email'
		// 			value={user.email}
		// 		/>
		// 		<InfoItem
		// 			icon={Phone}
		// 			label='Phone'
		// 			value={user.phone}
		// 		/>
		// 		<InfoItem
		// 			icon={MapPin}
		// 			label='Shipping Address'
		// 			value={address}
		// 		/>
		// 	</Section>

		// 	{/* Price Breakdown */}
		// 	<Section title='Price Summary'>
		// 		<div className='grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm'>
		// 			<div className='text-gray-600'>Items Total:</div>
		// 			<div className='text-right text-gray-800 font-medium col-span-1 sm:col-span-2'>
		// 				₹{totals.variantTotal}
		// 			</div>
		// 			<div className='text-gray-600'>
		// 				Add-ons Total:
		// 			</div>
		// 			<div className='text-right text-gray-800 font-medium col-span-1 sm:col-span-2'>
		// 				₹{totals.extrasTotal}
		// 			</div>
		// 			<div className='text-gray-600'>Discount:</div>
		// 			<div className='text-right text-green-600 font-medium col-span-1 sm:col-span-2'>
		// 				– ₹{totals.discountAmount}
		// 			</div>
		// 			<div className='text-gray-800 font-semibold'>
		// 				Final Amount:
		// 			</div>
		// 			<div className='text-right text-green-800 font-bold text-lg col-span-1 sm:col-span-2'>
		// 				₹{totals.total}
		// 			</div>
		// 		</div>
		// 	</Section>
		// </div>
	);
};

export default ViewOrder;
