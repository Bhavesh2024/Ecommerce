"use client";

import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { useOrder } from "@/hooks/useOrder";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import PageLoader from "@/components/loader/PageLoader";
import { handleOrder } from "@/utils/api/orderApi";
import { orderStatuses, paymentStatuses } from "@/utils/helper/status";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import Header from "@/components/header/Header";
import { formatPrice } from "@/utils/helper/formatter";
import dynamic from "next/dynamic";
import { NoItemLoader } from "@/components/loader/ItemLoader";
import DataTableLoader from "@/components/loader/DataTableLoader";
const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});

const Modal = dynamic(() => import("@/components/modal/Modal"), {
	ssr: false,
});

const Response = dynamic(() => import("@/components/modal/response/Response"), {
	ssr: false,
});

const Alert = dynamic(() => import("@/components/modal/alert/Alert"), {
	ssr: false,
});

const DataTable = dynamic(() => import("@/components/table/DataTable"), {
	ssr: true,
	loading: () => <DataTableLoader />,
});

const page = () => {
	const { data, isSuccess, isError, isLoading } = useOrder(true, "all");
	const router = useRouter();
	const { orders } = useAdminStoreState();
	const {
		isOpen,
		message,
		showError,
		showSuccess,
		type,
		closePopup,
		loading,
		startLoading,
	} = usePopupMessage();
	const { addAllItem, updateItem } = useAdminStoreActions();
	// const [openView, setOpenView] = useState(false);
	const [currentOrder, setCurrentOrder] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [openConfirmation, setOpenConfirmation] = useState(false);

	const { mutate: orderMutation, isSuccess: isOrder } = useMutation({
		mutationFn: handleOrder,
		onSuccess: (data) => {
			const { order, message } = data;
			setOpenConfirmation(false);
			updateItem("orders", order);
			showSuccess(message);
		},
		onError: (err) => {
			showError(err);
		},
		onSettled: () => {
			setTimeout(() => {
				closePopup();
			}, 3000);
		},
	});

	useEffect(() => {
		if (isSuccess && data) {
			const { orders } = data;
			addAllItem("orders", orders);
		}
	}, [isSuccess, data]);

	const updateStatus = (order) => {
		startLoading();
		orderMutation({
			method: "put",
			type: "update",
			data: order,
		});
	};

	const orderDataFormat = [
		{
			key: "index",
			name: "#",
			render: (val, row, index) => index + 1,
		},
		{
			key: "orderId",
			name: "ID",
		},
		{
			key: "product",
			name: "Product",
			render: (product) => product.name,
		},
		{
			key: "user",
			name: "Customer",
			render: (user) => user.name,
		},
		{
			key: "total",
			name: "Amount",
			render: (amount, row) => formatPrice(amount * row.quantity),
		},
		{
			key: "orderStatus",
			name: "Order Status",
			render: (status, order) => {
				const currentStatus = orderStatuses.find(
					(o) => o.value === status,
				);
				return (
					<div className='w-full'>
						<select
							name='status'
							className={`rounded-md border outline-0 border-slate-300 p-1 ${currentStatus?.bg} ${currentStatus?.text}`}
							value={status}
							onChange={(e) => {
								const updatedOrder = {
									...order,
									orderStatus: Number(
										e.target.value,
									),
								};
								setCurrentOrder(updatedOrder);
								// setSelectedStatus("order");
								// updateItem(
								// 	"orders",
								// 	updatedOrder,
								// );
								setOpenConfirmation(true);
							}}>
							{orderStatuses.map(
								({ label, value }) => (
									<option
										key={value}
										value={value}
										className='text-black'>
										{label}
									</option>
								),
							)}
						</select>
					</div>
				);
			},
		},
		{
			key: "paymentStatus",
			name: "Payment Status",
			render: (status, order) => {
				const currentStatus = paymentStatuses.find(
					(p) => p.value === status,
				);
				return (
					<div className='w-full'>
						<select
							name='paymentStatus'
							className={`rounded-md border outline-0 border-slate-300 p-1 ${currentStatus?.bg} ${currentStatus?.text}`}
							value={status}
							onChange={(e) => {
								const updatedOrder = {
									...order,
									paymentStatus: Number(
										e.target.value,
									),
								};
								setCurrentOrder(updatedOrder);
								// setSelectedStatus("payment");
								setOpenConfirmation(true);
							}}>
							{paymentStatuses.map(
								({ label, value }) => (
									<option
										key={value}
										value={value}
										className='text-black'>
										{label}
									</option>
								),
							)}
						</select>
					</div>
				);
			},
		},

		{
			key: "address",
			name: "Address",
		},
	];

	// const handleOrderView = (data) => {
	// 	setCurrentOrder(data);
	// 	setOpenView(true);
	// };

	// const handleCloseView = () => {
	// 	setOpenView(false);
	// };
	return (
		<>
			{isLoading && <PageLoader />}{" "}
			{isError && (
				<NoItem
					message={"No Orders Found"}
					icon={
						<Truck className='size-16 text-purple-500' />
					}
				/>
			)}
			{orders && Array.isArray(orders) && orders.length > 0 && (
				<>
					<div className='flex flex-col gap-1 w-11/12 mx-auto mt-4'>
						<Header
							title='Order'
							enableBtn={false}
						/>
						<DataTable
							data={orderDataFormat}
							values={orders}
							onView={(order) =>
								// handleOrderView(order)
								router.push(
									`/user/admin/orders/${order.id}/view`,
								)
							}
						/>
					</div>
				</>
			)}
			{/* Order View */}
			{/* <Modal
				open={openView}
				onClose={handleCloseView}>
				<div className='w-full text-nowrap max-w-xl min-h-60'>
					<ViewOrder
						data={currentOrder}
						onClose={handleCloseView}
					/>
				</div>
			</Modal> */}
			{/* Confirm Alert */}
			<Modal
				open={openConfirmation}
				onClose={() => setOpenConfirmation(false)}>
				<Alert
					title={"Update"}
					isOpen={openConfirmation}
					message={`Are you sure to update ${
						selectedStatus === "payment"
							? "Payment"
							: "Order"
					} Status?`}
					onConfirm={() => updateStatus(currentOrder)}
					onCancel={() => setOpenConfirmation(false)}
				/>
			</Modal>
			{/* Response Modal */}
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						message={message}
						type={type}
						onClose={closePopup}
					/>
				)}
			</Modal>
		</>
	);
};

export default page;
