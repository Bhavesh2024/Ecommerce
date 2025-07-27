"use client";

import { useDashboard } from "@/hooks/useDashboard";
import PageLoader from "@/components/loader/PageLoader";
import {
	BanknoteArrowDown,
	BanknoteArrowUp,
	Package,
	Truck,
	Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatPrice } from "@/utils/helper/formatter";
import dynamic from "next/dynamic";
import { DashboardCardLoader } from "@/components/loader/CardLoader";

const DashboardCard = dynamic(() => import("@/components/card/DashboardCard"), {
	ssr: true,
	loading: () => <DashboardCardLoader />,
});

const dashboardItems = [
	{ key: "user", label: "Customer", icon: Users },
	{ key: "product", label: "Products", icon: Package },
	{ key: "order", label: "Order", icon: Truck },
	{
		key: "revenue",
		label: "Revenue",
		icon: BanknoteArrowUp,
		isCurrency: true,
	},
	{
		key: "refunds",
		label: "Refund",
		icon: BanknoteArrowDown,
		isCurrency: true,
	},
];

const Dashboard = () => {
	const { data, isSuccess, isLoading, isError } = useDashboard();
	const [dashboard, setDashboard] = useState(null);

	useEffect(() => {
		if (isSuccess && data) {
			setDashboard(data.dashboard);
		}
	}, [isSuccess]);

	if (isLoading) return <PageLoader />;
	if (isError) return <div>No Data Found</div>;

	return (
		<div className='w-full flex items-center justify-center'>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full p-2 md:w-3/4 gap-3 justify-center items-center'>
				{dashboard &&
					dashboardItems.map(
						({ key, label, icon, isCurrency }) => (
							<DashboardCard
								key={key}
								icon={icon}
								label={label}
								value={
									isCurrency
										? formatPrice(
												dashboard
													.count[
													key
												],
										  )
										: dashboard.count[
												key
										  ]
								}
							/>
						),
					)}
			</div>
		</div>
	);
};

export default Dashboard;
