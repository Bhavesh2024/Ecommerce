"use client";

import { useOrder } from "@/hooks/useOrder";
import PageLoader from "@/components/loader/PageLoader";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { NoItemLoader } from "@/components/loader/ItemLoader";
import dynamic from "next/dynamic";
import { ViewOrderLoader } from "@/components/loader/LayoutLoader";
const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});
const ViewOrder = dynamic(() => import("@/components/modal/view/ViewOrder"), {
	ssr: false,
	loading: () => <ViewOrderLoader />,
});
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
			{isError && (
				<NoItem
					message={"No Orders Found"}
					icon={
						<Truck className='size-16 text-purple-500' />
					}
				/>
			)}
			{order && action == "view" && <ViewOrder data={order} />}
		</>
	);
};

export default Page;
