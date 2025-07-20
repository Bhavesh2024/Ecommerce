"use client";

// import OrderCard from "@/components/card/OrderCard";
// import OrderSummary from "@/components/card/OrderSummary";
import PageLoader from "@/components/loader/PageLoader";
import NoItem from "@/components/not-found/NoItem";
import ProductNav from "@/layout/navbar/ProductNav";
import {
	useCustomerStoreActions,
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import { useOrder } from "@/hooks/useOrder";
import React, { useEffect, useRef, useState } from "react";
import { Package } from "lucide-react";
import dynamic from "next/dynamic";
import {
	OrderCardLoader,
	OrderSummaryLoader,
} from "@/components/loader/CardLoader";
const OrderCard = dynamic(() => import("@/components/card/OrderCard"), {
	loading: () => <OrderCardLoader />,
	ssr: true,
});
const OrderSummary = dynamic(() => import("@/components/card/OrderSummary"), {
	loading: () => <OrderSummaryLoader />,
	ssr: false,
});

const page = () => {
	const {
		data: responseOrders,
		isSuccess,
		isLoading,
		isError,
	} = useOrder(true, "all");

	const { orders } = useCustomerStoreState();
	const { addAllItems } = useCustomerStoreActions();
	const [active, setActive] = useState(0);

	// Ref to track OrderSummary height
	const summaryRef = useRef(null);
	const [orderCardHeight, setOrderCardHeight] = useState("auto");

	// Handle storing orders from API
	useEffect(() => {
		if (responseOrders && isSuccess) {
			const { orders } = responseOrders;
			addAllItems("orders", orders);
		}
	}, [isSuccess, responseOrders]);

	// Sync OrderCard List height based on OrderSummary height
	useEffect(() => {
		if (summaryRef.current) {
			const summaryHeight = summaryRef.current.offsetHeight;
			const maxAllowed = window.innerHeight * 0.9;

			if (summaryHeight > maxAllowed) {
				setOrderCardHeight(summaryHeight + "px");
			} else {
				setOrderCardHeight("auto");
			}
		}
	}, [active, orders]);

	return (
		<>
			<div className='fixed top-0 w-full start-0 z-30'>
				<ProductNav />
			</div>

			<div className='max-h-screen max-w-full flex justify-center'>
				{isLoading && <PageLoader />}
				{!isLoading && (orders.length === 0 || isError) && (
					<div className='flex items-center h-screen'>
						<NoItem
							message={"No Order Found"}
							icon={
								<Package className='size-40 text-purple-500 my-auto' />
							}
						/>
					</div>
				)}

				{isSuccess && orders && (
					<div className='flex lg:gap-5 w-full lg:w-4/5 xl:w-3/4 mx-auto z-10 md:flex-row mt-20'>
						{/* Left - OrderCard List */}
						<div
							className='w-full px-2 max-w-screen md:w-2/5 flex flex-col gap-3 z-10 overflow-auto pb-5'
							style={{ height: orderCardHeight }}>
							{orders.map((order, index) => (
								<OrderCard
									key={order._id}
									order={order}
									isSelected={
										index === active
									}
									activate={setActive}
									index={index}
								/>
							))}
						</div>

						{/* Right - OrderSummary */}
						<div className='w-10/12 hidden md:block px-3 mb-5'>
							<div ref={summaryRef}>
								<OrderSummary
									order={orders[active]}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default page;
