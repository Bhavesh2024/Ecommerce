"use client";
import { Check, X } from "lucide-react";
import React, { useState } from "react";
import { format } from "date-fns";
import { orderStatuses, paymentStatuses } from "@/utils/helper/status";
import { useMutation } from "@tanstack/react-query";
import { handleOrder } from "@/utils/api/orderApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import PageLoader from "../loader/PageLoader";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("../modal/Modal"), {
	ssr: false,
	loading: () => <PageLoader />,
});

const Response = dynamic(() => import("../modal/response/Response"), {
	ssr: false,
	loading: () => <PageLoader />,
});

const Alert = dynamic(() => import("../modal/alert/Alert"), {
	ssr: false,
	loading: () => <PageLoader />,
});
const OrderSummary = ({
	order,
	closePopup,
	hideClose = true,
	role = "user",
}) => {
	if (!order)
		return <div className='text-gray-500'>No order selected.</div>;

	const {
		orderId,
		orderItem,
		product,
		total,
		created_at,
		paymentStatus = 0,
		orderStatus = 0,
		updated_at,
		quantity,
	} = order;

	const orderStatusObj = orderStatuses.find((s) => s.value === orderStatus);
	const paymentStatusObj = paymentStatuses.find(
		(s) => s.value === paymentStatus,
	);
	const [cancelOrderAlert, setCancelOrderAlert] = useState(false);
	const {
		message,
		isOpen,
		closePopup: cancelOrderClosePopup,
		showError,
		showSuccess,
		startLoading,
		type,
		loading,
	} = usePopupMessage();
	const { mutate: cancelOrderMutation } = useMutation({
		mutationFn: handleOrder,
		onSuccess: (response) => {
			showSuccess(response.message);
		},
		onError: (error) => {
			showError(error);
		},
		onSettled: () => {
			setTimeout(() => {
				cancelOrderClosePopup();
			}, 3000);
		},
	});

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
		if (!groupedVariants[matchedType])
			groupedVariants[matchedType] = [];
		groupedVariants[matchedType].push(variant);
	});

	const orderDate = created_at
		? format(new Date(created_at), "dd MMM yyyy")
		: "-";
	const estimatedDate = created_at
		? format(
				new Date(
					new Date(created_at).getTime() +
						7 * 24 * 60 * 60 * 1000,
				),
				"dd MMM yyyy",
		  )
		: "-";
	const deliveredDate =
		orderStatus == 3
			? format(
					new Date(
						new Date(updated_at).getTime() +
							7 * 24 * 60 * 60 * 1000,
					),
					"dd MMM yyyy",
			  )
			: null;

	const handleCancelOrder = () => {
		const payload = {
			paymentStatus: paymentStatus,
			orderStatus: 4,
			id: order.id,
		};
		setCancelOrderAlert(false);
		startLoading();
		cancelOrderMutation({
			method: "put",
			type: "update",
			data: payload,
		});
	};
	return (
		<div className='w-full max-w-2xl mx-auto bg-white shadow-sm rounded-2xl p-6 relative space-y-6 border border-purple-200'>
			{/* Close Button */}
			{!hideClose && (
				<X
					className='size-5 text-slate-500 absolute top-4 end-4 md:hidden cursor-pointer hover:text-red-500'
					onClick={closePopup}
				/>
			)}

			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-200 pb-3'>
				<h2 className='text-xl font-semibold text-slate-800'>
					{product?.name}
				</h2>
				<span className='text-xs text-slate-500 font-medium'>
					Order ID: #{orderId}
				</span>
			</div>
			{/* Cancel Order */}
			{![3, 4].includes(orderStatus) && (
				<div className='mt-4 flex items-center justify-between border border-purple-200 bg-purple-50 rounded-lg px-2 gap-2 py-3 text-sm text-purple-800 shadow-sm'>
					<span className='font-medium'>
						Want to cancel this order?
					</span>
					<button
						onClick={() => setCancelOrderAlert(true)}
						className='p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition'>
						<Check className='size-4' />
					</button>
				</div>
			)}

			{/* Order Info and Status */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600'>
				{/* Order Info */}
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span className='font-medium text-slate-700'>
							Order Date:
						</span>
						<span>{orderDate}</span>
					</div>
					<div className='flex justify-between'>
						<span className='font-medium text-slate-700'>
							Estimated Delivery:
						</span>
						<span>{estimatedDate}</span>
					</div>
					{deliveredDate && (
						<div className='flex justify-between'>
							<span className='font-medium text-slate-700'>
								Delivered Date:
							</span>
							<span>{deliveredDate}</span>
						</div>
					)}
				</div>

				{/* Status Info */}
				<div className='space-y-2'>
					<div className='flex justify-between items-center'>
						<span className='font-medium text-slate-700'>
							Order Status:
						</span>
						{orderStatusObj && (
							<span
								className={`text-xs px-2 py-1 rounded-full ${orderStatusObj.bg} ${orderStatusObj.text}`}>
								{orderStatusObj.label}
							</span>
						)}
					</div>
					<div className='flex justify-between items-center'>
						<span className='font-medium text-slate-700'>
							Payment Status:
						</span>
						{paymentStatusObj && (
							<span
								className={`text-xs px-2 py-1 rounded-full ${paymentStatusObj.bg} ${paymentStatusObj.text}`}>
								{paymentStatusObj.label}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Variants */}
			{Object.entries(groupedVariants).map(
				([type, variants], idx) => (
					<div
						key={idx}
						className='border border-slate-300 rounded-md p-4 bg-purple-50 space-y-2'>
						<p className='text-sm font-medium text-slate-700'>
							{type}
						</p>
						<ul className='text-sm text-slate-600 space-y-1'>
							{variants.map((v, i) => (
								<li
									key={i}
									className='flex justify-between'>
									<span className='font-medium'>
										{v.label}{" "}
										<span className='text-xs text-slate-400'>
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
				<div className='border border-slate-300 rounded-md p-4 bg-purple-50'>
					<h3 className='font-medium text-slate-700 mb-2'>
						Extras
					</h3>
					<ul className='text-sm text-slate-700 space-y-1'>
						{orderItem.extras.map((extra, index) => (
							<li
								key={index}
								className='flex justify-between'>
								<span className='font-medium'>
									{extra.name}
								</span>
								<span>₹{extra.price}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Totals */}
			<div className='border-t border-slate-300 pt-4 text-sm text-slate-700 space-y-2'>
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
					<span className='font-medium'>Bundle</span>
					<span>{quantity?.toFixed(2)}</span>
				</div>
			</div>

			{/* Final Total */}
			<div className='flex justify-between items-center border-t border-slate-300 pt-4'>
				<span className=' font-semibold text-slate-800'>
					Total
				</span>
				<span className='font-semibold text-purple-700'>
					₹{total * quantity}
				</span>
			</div>

			{/* Non-refundable Note */}
			{role != "admin" && ![3, 4].includes(orderStatus) && (
				<div className='flex gap-2 items-start border border-yellow-200 bg-yellow-50 rounded-lg px-4 py-3 text-sm text-yellow-700 shadow-sm'>
					<p>
						<span className='font-semibold'>Note:</span>{" "}
						<span>
							This order is no longer refundable as
							it was placed more than 2 days ago.
						</span>
					</p>
				</div>
			)}

			<Modal
				open={cancelOrderAlert}
				onClose={() => setCancelOrderAlert(false)}>
				<Alert
					title={"Cancel Order"}
					isOpen={cancelOrderAlert}
					message={"Are you sure to Cancel Order"}
					onConfirm={handleCancelOrder}
					onCancel={() => setCancelOrderAlert(false)}
				/>
			</Modal>
			<Modal
				open={isOpen || loading}
				onClose={cancelOrderClosePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						type={type}
						message={message}
						onClose={cancelOrderClosePopup}
					/>
				)}
			</Modal>
		</div>
	);
};

export default OrderSummary;
