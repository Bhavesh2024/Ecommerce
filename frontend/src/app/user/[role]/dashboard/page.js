"use client";

import { useDashboard } from "@/hooks/useDashboard";
import PageLoader from "@/components/loader/PageLoader";
import { Package, Package2, Truck, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
	const { data, isSuccess, isLoading, isError } = useDashboard();
	const [dashboard, setDashboard] = useState(null);

	useEffect(() => {
		if (isSuccess && data) {
			const { dashboard } = data;
			setDashboard(dashboard);
		}
	}, [isSuccess]);
	return (
		<>
			{isLoading && <PageLoader />}
			{isError && <div>No Data Found</div>}
			{isSuccess && dashboard && (
				<div className='w-full flex items-center justify-center'>
					<div className='grid grid-cols-2 md:grid-cols-3 w-full p-2 md:w-1/2 gap-3 justify-center items-center'>
						<div className='h-32 rounded-md border border-slate-300 bg-sky-100 w-full p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Users />
								<span>Customer</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.user}
							</div>
						</div>
						<div className='h-32 rounded-md border border-slate-300 w-full bg-amber-100 p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Package />
								<span>Products</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.product}
							</div>
						</div>
						<div className='h-32  rounded-md border border-slate-300 w-full bg-indigo-100 p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Truck />
								<span>Order</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.order}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dashboard;
