"use client";

import React, { useEffect } from "react";
import { usePayment } from "@/hooks/usePayment";
import Header from "@/components/header/Header";
import PageLoader from "@/components/loader/PageLoader";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { paymentStatuses } from "@/utils/helper/status";
import { WalletCards } from "lucide-react";
import dynamic from "next/dynamic";
import DataTableLoader from "@/components/loader/DataTableLoader";
import { NoItemLoader } from "@/components/loader/ItemLoader";
const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});
const DataTable = dynamic(() => import("@/components/table/DataTable"), {
	ssr: true,
	loading: () => <DataTableLoader />,
});
const page = () => {
	const {
		data: paymentResponse,
		isSuccess,
		isLoading,
		isError,
	} = usePayment(true, "all");

	const { payments } = useAdminStoreState();
	const { addAllItem } = useAdminStoreActions();

	useEffect(() => {
		if (isSuccess && paymentResponse?.payments) {
			addAllItem("payments", paymentResponse.payments);
		}
	}, [isSuccess, paymentResponse]);

	const paymentColumns = [
		{ key: "id", name: "#", render: (val, row, i) => i + 1 },
		{ key: "paymentId", name: "Payment ID" },
		{ key: "orderId", name: "Order ID" },
		{
			key: "productName",
			name: "Product",
			render: (val, row) => row.productName || "N/A",
		},
		{
			key: "userName",
			name: "Customer",
			render: (val, row) => row.userName,
		},
		{
			key: "userEmail",
			name: "Email",
			render: (val, row) => row.userEmail || "N/A",
		},
		{
			key: "userPhone",
			name: "Phone",
			render: (val, row) => row.userPhone || "N/A",
		},

		{ key: "amount", name: "Amount" },
		{
			key: "type",
			name: "Type",
			render: (val) => <span className='capitalize'>{val}</span>,
		},
		{
			key: "provider",
			name: "Provider",
			render: (val) => <span className='capitalize'>{val}</span>,
		},
		{
			key: "method",
			name: "Method",
			render: (val) => <span className='capitalize'>{val}</span>,
		},
		{
			key: "paymentStatus",
			name: "Status",
			render: (val) => {
				const paymentStatusObj = paymentStatuses.find(
					(s) => s.value === val,
				);
				return (
					<span
						className={`text-xs px-2 py-1 rounded-full ${paymentStatusObj.bg} ${paymentStatusObj.text}`}>
						{paymentStatusObj.label}
					</span>
				);
			},
		},
		{
			key: "paidAt",
			name: "Paid At",
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
				title='Payments'
				enableBtn={false}
			/>
			<div className='w-full'>
				{isLoading && <PageLoader />}
				{isError && (
					<NoItem
						message='No Payments Found'
						icon={
							<WalletCards className='size-16 text-purple-500' />
						}
					/>
				)}
				{isSuccess && (
					<DataTable
						data={paymentColumns}
						values={payments}
					/>
				)}
			</div>
		</div>
	);
};

export default page;
