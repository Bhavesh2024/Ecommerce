"use client";

import React from "react";
import { ArrowLeft, Mail, Phone, User, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { paymentStatuses, orderStatuses } from "@/utils/helper/status";
import OrderSummary from "@/components/card/OrderSummary";

const Section = ({ title, children }) => (
	<div className='mb-6 bg-white border rounded-2xl shadow-sm border-slate-200'>
		<h3 className='bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 rounded-t-2xl border-b'>
			{title}
		</h3>
		<div className='px-5 py-4 text-sm'>{children}</div>
	</div>
);

const StatusPill = ({ value, list }) => {
	const match = list.find((s) => s.value === value);
	return match ? (
		<span
			className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${match.bg} ${match.text}`}>
			{match.label}
		</span>
	) : null;
};

const InfoItem = ({ icon: Icon, label, value }) => (
	<div className='flex items-start gap-3 py-2'>
		<Icon className='w-5 h-5 mt-1 text-purple-600' />
		<div>
			<div className='text-slate-500 text-xs'>{label}</div>
			<div className='text-slate-800 font-medium text-sm'>
				{value}
			</div>
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
		<div className='flex flex-col gap-4 w-full min-h-[80vh] justify-start p-4 mt-4 bg-slate-50'>
			{/* Header */}
			<div className='flex justify-between items-center px-4 md:px-6 w-full md:w-11/12 xl:w-4/5 mx-auto border border-slate-300 bg-white rounded-xl shadow-md py-4'>
				<button
					onClick={() => router.back()}
					title='Back'
					className='text-slate-600 hover:text-purple-600 transition'>
					<ArrowLeft className='w-5 h-5' />
				</button>
				<h1 className='text-base font-semibold text-purple-700'>
					Order Summary
				</h1>
			</div>

			{/* Main Content */}
			<div className='flex flex-col md:flex-row gap-4 w-full md:w-11/12 xl:w-4/5 mx-auto'>
				{/* Left Panel */}
				<div className='md:w-2/5 w-full bg-white border border-slate-300 rounded-xl shadow-sm p-4 flex flex-col gap-4'>
					{/* Product Thumbnail */}
					<div className='flex flex-col items-center text-center'>
						<img
							src={product.thumbnail}
							className='h-32 w-36 rounded-lg shadow-sm border border-slate-200 mix-blend-multiply object-cover'
							alt={product.name}
						/>
						<div className='mt-2 text-sm font-semibold text-slate-800'>
							{product.name}
						</div>
					</div>

					{/* User Info */}
					<div className='border-t pt-3 border-slate-200'>
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

					{/* Status */}
					<div className='flex flex-col gap-2 border-t pt-3 border-slate-200'>
						<div className='flex justify-between items-center'>
							<span className='text-xs text-slate-500 font-medium'>
								Order Status
							</span>
							<StatusPill
								value={orderStatus}
								list={orderStatuses}
							/>
						</div>
						<div className='flex justify-between items-center'>
							<span className='text-xs text-slate-500 font-medium'>
								Payment Status
							</span>
							<StatusPill
								value={paymentStatus}
								list={paymentStatuses}
							/>
						</div>
					</div>
				</div>

				{/* Right Panel */}
				<div className='w-full md:w-3/5 h-full'>
					<OrderSummary
						order={data}
						hideClose={true}
						role='admin'
					/>
				</div>
			</div>
		</div>
	);
};

export default ViewOrder;
