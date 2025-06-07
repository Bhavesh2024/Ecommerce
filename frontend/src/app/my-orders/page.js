"use client";

import OrderCard from "@/components/card/OrderCard";
import OrderSummary from "@/components/card/OrderSummary";
import PageLoader from "@/components/loader/PageLoader";
import NoItem from "@/components/not-found/NoItem";
import {
	useCustomerStoreActions,
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import { useOrder } from "@/hooks/useOrder";
import ProductNav from "@/layout/navbar/ProductNav";
import React, { useEffect, useState } from "react";

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
	useEffect(() => {
		if (responseOrders && isSuccess) {
			const { orders } = responseOrders;
			addAllItems("orders", orders);
		}
	}, [isSuccess, responseOrders]);
	return (
		<>
			<div className='fixed top-0 w-full start-0 z-30'>
				<ProductNav />
			</div>
			<div className='max-h-screen w-full flex justify-center mt-20'>
				{isLoading && <PageLoader />}
				{!isLoading && (orders.length == 0 || isError) && (
					<NoItem message={"No Order Found"} />
				)}
				{isSuccess && orders && (
					<>
						<div className='flex lg:gap-5 w-full lg:w-4/5 xl:w-3/4 mx-auto z-10 md:flex-row'>
							<div className='w-full px-2 max-w-screen md:w-2/5 flex flex-col gap-3 z-10'>
								{orders.map((order, index) => (
									<OrderCard
										order={order}
										isSelected={
											index ==
											active
										}
										activate={setActive}
										index={index}
									/>
								))}
							</div>
							<div className='w-10/12 hidden md:block px-3'>
								<OrderSummary
									order={orders[active]}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default page;
