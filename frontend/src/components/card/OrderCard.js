"use client";

import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import OrderSummary from "./OrderSummary";
import { X } from "lucide-react";

const OrderCard = ({ order, isSelected = false, activate, index }) => {
	const { orderId, orderItem, total, product, address, paymentStatus } =
		order;
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

	const shortStatus = (status) => {
		const paymentStatus = {
			0: "Pending",
			1: "Completed",
		};
		return paymentStatus[status];
	};

	return (
		<div
			className={`w-full hover:bg-sky-100 ${
				!isMobile && isSelected
					? "border-2 border-indigo-100 shadow-md shadow-neutral-600 bg-gray-50"
					: "border border-slate-300 shadow-sm"
			} rounded-xl p-4 flex gap-4  hover:shadow-md transition-all relative z-0`}
			onClick={handleClick}>
			{/* Image */}
			<div className='w-28 lg:w-32 h-32 flex-shrink-0'>
				<img
					src={product.thumbnail}
					alt={product.name}
					className='w-full h-full object-fill rounded-md'
				/>
			</div>

			{/* Details */}
			<div className='flex flex-col justify-between flex-grow'>
				<div className='flex justify-between items-start'>
					<div className='flex flex-col gap-2'>
						<h2 className='text-lg font-semibold'>
							{product.name}
						</h2>

						<p className='text-xs text-slate-600'>
							<strong>Total Units:</strong>{" "}
							{orderItem.totals.totalUnits}
						</p>
						<p className='text-xs text-slate-600'>
							<strong>Total Price:</strong> ₹
							{total.toLocaleString()}
						</p>
					</div>
				</div>

				<div className='flex gap-2 items-center'>
					<span
						className={`text-xs px-2 py-2 rounded ${
							paymentStatus === 1
								? "bg-emerald-100 text-green-700"
								: "bg-red-100 text-red-700"
						}`}>
						{shortStatus(paymentStatus)}
					</span>

					{/* View Detail Button (optional, doesn't need onClick now) */}
					<button className='text-xs px-2 py-2 rounded text-indigo-700 bg-indigo-100 text-nowrap min-w-16'>
						View
					</button>
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
					/>
				</div>
			</Modal>
		</div>
	);
};

export default OrderCard;
