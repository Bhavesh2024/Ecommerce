"use client";

import { useDashboard } from "@/hooks/useDashboard";
import PageLoader from "@/components/loader/PageLoader";
import {
	Banknote,
	BanknoteArrowDown,
	BanknoteArrowUp,
	Package,
	Package2,
	Truck,
	Users,
	Wallet,
	Wallet2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatPrice } from "@/utils/helper/formatter";

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
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full p-2 md:w-3/4 gap-3 justify-center items-center'>
						<div className='h-32 rounded-md border border-slate-300 bg-white w-full p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Users className='text-purple-500' />
								<span className='text-slate-700 font-medium'>
									Customer
								</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.user}
							</div>
						</div>
						<div className='h-32 rounded-md border border-slate-300 w-full bg-white p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Package className='text-purple-500' />
								<span className='text-slate-700 font-medium'>
									Products
								</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.product}
							</div>
						</div>
						<div className='h-32  rounded-md border border-slate-300 w-full bg-white p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<Truck className='text-purple-500' />
								<span className='text-slate-700 font-medium'>
									Order
								</span>
							</div>
							<div className='flex items-center h-4/5 text-3xl text-gray-600 font-semibold justify-center'>
								{dashboard.count.order}
							</div>
						</div>
						<div className='h-32  rounded-md border border-slate-300 w-full bg-white p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<BanknoteArrowUp className='text-purple-500' />
								<span className='text-slate-700 font-medium'>
									Revenue
								</span>
							</div>
							<div className='flex items-center h-4/5 text-xl text-gray-600 font-semibold justify-center'>
								{formatPrice(
									dashboard.count.revenue,
								)}
							</div>
						</div>
						<div className='h-32  rounded-md border border-slate-300 w-full bg-white p-3 shadow'>
							<div className='flex items-center gap-2 text-slate-600'>
								<BanknoteArrowDown className='text-purple-500' />
								<span className='text-slate-700 font-medium'>
									Refund
								</span>
							</div>
							<div className='flex items-center h-4/5 text-xl text-gray-600 font-semibold justify-center'>
								{formatPrice(
									dashboard.count.refunds,
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Dashboard;
