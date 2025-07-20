"use client";

import React, { useEffect, useState } from "react";
import { paymentStatuses, orderStatuses } from "@/utils/helper/status";
import { formatPrice } from "@/utils/helper/formatter";
import { formatDate } from "date-fns";
import dynamic from "next/dynamic";
import PageLoader from "../loader/PageLoader";
import { OrderSummaryLoader } from "../loader/CardLoader";

const Modal = dynamic(() => import("../modal/Modal"), {
	ssr: false,
	loading: () => <PageLoader />,
});
const OrderSummary = dynamic(() => import("./OrderSummary"), {
	ssr: false,
	loading: () => <OrderSummaryLoader />,
});

const OrderCard = ({ order, isSelected = false, activate, index }) => {
	const { total, product, paymentStatus, orderStatus, created_at } = order;
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleClick = () => {
		if (isMobile) {
			setOpen(true);
		} else {
			activate(index);
		}
	};

	const getStatus = (statusList, value) => {
		return statusList.find((item) => item.value === value);
	};

	const payment = getStatus(paymentStatuses, paymentStatus);
	const orderLabel = getStatus(orderStatuses, orderStatus);

	return (
		<div
			className={`w-full bg-purple-50 hover:bg-purple-50 ${
				!isMobile && isSelected
					? "border-2 border-purple-100 shadow-md shadow-purple-300 bg-purple-100"
					: "border border-purple-300 shadow-sm"
			} rounded-xl  flex gap-4  hover:shadow-md transition-all relative z-0`}
			onClick={handleClick}>
			{/* Image */}
			<div className='w-28 lg:w-32 h-full flex-shrink-0 bg-purple'>
				<img
					src={product.thumbnail}
					alt={product.name}
					className='w-full min-h-40 h-full object-fill rounded-s-md mix-blend-multiply'
				/>
			</div>

			{/* Details */}
			<div className='flex flex-col justify-between flex-grow p-4'>
				<div className='flex justify-between items-start'>
					<div className='flex flex-col gap-2'>
						<h2 className='font-semibold text-slate-800 font-sans'>
							{product.name}
						</h2>

						<p className='text-xs text-slate-600'>
							<strong>Order Date:</strong>{" "}
							{formatDate(
								new Date(created_at),
								"d MMMM yyyy",
							)}
						</p>
						<p className='text-xs text-slate-600'>
							<strong>Price:</strong>{" "}
							{formatPrice(total.toLocaleString())}
						</p>
					</div>
				</div>

				<div className='flex gap-2 items-center'>
					<span
						className={`text-xs px-2 py-2 rounded-full ${payment?.bg} ${payment?.text}`}>
						{payment?.label}
					</span>
					<span
						className={`text-xs px-2 py-2 rounded-full ${orderLabel?.bg} ${orderLabel?.text}`}>
						{orderLabel?.label}
					</span>

					{/* View Detail Button (optional, doesn't need onClick now) */}
					{/* <button className='text-xs px-2 py-2 rounded-full text-purple-600 bg-purple-800/20 text-nowrap min-w-16'>
						View
					</button> */}
				</div>
			</div>

			{/* Modal for mobile */}
			<Modal
				open={open}
				onClose={() => setOpen(false)}>
				<div className='w-screen relative'>
					<OrderSummary
						order={order}
						closePopup={() => setOpen(false)}
						hideClose={false}
					/>
				</div>
			</Modal>
		</div>
	);
};

export default OrderCard;
