"use client";

import {
	Bell,
	LayoutDashboard,
	Package,
	User,
	Truck,
	WalletCards,
	CreditCard,
} from "lucide-react";
export const renderUserActivities = (role) => {
	return [
		{
			icon: <LayoutDashboard className='text-purple-700' />,
			name: "Dashboard",
			prefix: `/user/${role}/`,
			link: "dashboard",
			allowedRoles: ["admin"],
		},

		{
			icon: <User className='text-purple-700' />,
			name: "User",
			prefix: `/user/${role}/`,
			link: "users",
			allowedRoles: ["admin"],
		},
		{
			icon: <Package className='text-purple-700' />,
			name: "Product",
			prefix: `/user/${role}/`,
			link: "products",
			allowedRoles: ["admin"],
		},
		{
			icon: <Truck className='text-purple-700' />,
			name: "Order",
			prefix: `/user/${role}/`,
			link: "orders",
			allowedRoles: ["admin"],
		},
		{
			icon: <Bell className='text-purple-700' />,
			name: "Notifications",
			prefix: `/user/${role}/`,
			link: "notifications",
			allowedRoles: ["admin"],
		},
		{
			icon: <WalletCards className='text-purple-700' />,
			name: "Payment",
			prefix: `/user/${role}/`,
			link: "payments",
			allowedRoles: ["admin"],
		},
		{
			icon: <CreditCard className='text-purple-700' />,
			name: "Refund",
			prefix: `/user/${role}/`,
			link: "refunds",
			allowedRoles: ["admin"],
		},
	];
};
