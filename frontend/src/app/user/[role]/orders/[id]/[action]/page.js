"use client";

import { useOrder } from "@/hooks/useOrder";
import PageLoader from "@/components/loader/PageLoader";
import ViewOrder from "@/components/modal/view/ViewOrder";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
	const { id, action } = useParams();
	const [order, setOrder] = useState(null);
	const {
		data: responseOrder,
		isSuccess,
		isError,
		isLoading,
	} = useOrder(true, `${id}`);
	useEffect(() => {
		if (isSuccess && responseOrder) {
			const { order } = responseOrder;
			setOrder(order);
		}
	}, [isSuccess, responseOrder]);
	return (
		<>
			{isLoading && <PageLoader />}
			{isError && <div>No Order Found</div>}
			{order && action == "view" && <ViewOrder data={order} />}
		</>
	);
};

export default Page;
