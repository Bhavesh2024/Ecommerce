"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { OrderSummaryLoader } from "@/components/loader/CardLoader";

const OrderSummary = dynamic(() => import("@/components/card/OrderSummary"), {
	ssr: true,
	loading: () => <OrderSummaryLoader />,
});
import OrderInfo from "@/components/card/OrderInfo";

const ViewOrder = ({ data }) => {
	const router = useRouter();
	const { product, user, address, paymentStatus, orderStatus } = data;

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
				<OrderInfo
					orderStatus={orderStatus}
					product={product}
					paymentStatus={paymentStatus}
					user={user}
					address={address}
				/>

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
