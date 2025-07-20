"use client";

import React, { useEffect } from "react";
import { usePayment } from "@/hooks/usePayment";
import Header from "@/components/header/Header";
import PageLoader from "@/components/loader/PageLoader";
import NoItem from "@/components/not-found/NoItem";
import DataTable from "@/components/table/DataTable";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { CreditCard, RotateCcw } from "lucide-react";
import { formatPrice } from "@/utils/helper/formatter";

const page = () => {
	const {
		data: refundResponse,
		isSuccess,
		isLoading,
		isError,
	} = usePayment(true, "refund/all");

	const { refunds } = useAdminStoreState();
	const { addAllItem } = useAdminStoreActions();

	useEffect(() => {
		if (isSuccess && refundResponse?.refunds) {
			addAllItem("refunds", refundResponse.refunds);
		}
	}, [isSuccess, refundResponse]);

	const refundColumns = [
		{ key: "index", name: "#", render: (val, row, i) => i + 1 },
		{ key: "refundId", name: "Refund ID" },
		{ key: "paymentId", name: "Payment ID" },
		{ key: "orderId", name: "Order ID" },
		{
			key: "productName",
			name: "Product",
			render: (val, row) => row.productName || "N/A",
		},
		{
			key: "user",
			name: "Customer",
			render: (val, row) =>
				`${row.user?.name || "N/A"} (${
					row.user?.email || "N/A"
				})`,
		},
		{
			key: "amount",
			name: "Amount",
			render: (val) => formatPrice(val),
		},
		{
			key: "currency",
			name: "Currency",
		},
		{
			key: "mode",
			name: "Mode",
			render: (val) => <span className='capitalize'>{val}</span>,
		},
		{
			key: "refundDate",
			name: "Refund Date",
			render: (val) => (
				<span>
					{new Date(val).toLocaleDateString("en-GB", {
						day: "2-digit",
						month: "long",
						year: "numeric",
					})}
				</span>
			),
		},
	];

	return (
		<div className='flex mx-auto w-11/12 flex-col gap-1'>
			<Header
				title='Refund'
				enableBtn={false}
			/>
			<div className='w-full'>
				{isLoading && <PageLoader />}
				{isError && (
					<NoItem
						message='No Refunds Found'
						icon={
							<CreditCard className='size-16 text-purple-500' />
						}
					/>
				)}
				{isSuccess && refunds && (
					<>
						<DataTable
							data={refundColumns}
							values={refunds}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default page;
