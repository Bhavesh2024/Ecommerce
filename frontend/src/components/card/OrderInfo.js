import React from "react";
import Image from "next/image";
import { orderStatuses, paymentStatuses } from "@/utils/helper/status";
import StatusBadge from "../badge/StatusBadge";
import InfoItem from "../item/InfoItem";
import { Mail, Phone, User, MapPin } from "lucide-react";

const OrderInfo = ({ product, user, orderStatus, paymentStatus, address }) => {
	const userInfo = [
		{ icon: User, label: "Name", value: user.name },
		{ icon: Mail, label: "Email", value: user.email },
		{ icon: Phone, label: "Phone", value: user.phone },
		{ icon: MapPin, label: "Shipping Address", value: address },
	];

	return (
		<div className='md:w-2/5 w-full bg-white border border-slate-300 rounded-xl shadow-sm p-4 flex flex-col gap-4 sticky top-24'>
			{/* Product Thumbnail */}
			<div className='flex flex-col items-center text-center'>
				<div className='relative h-32 w-36'>
					<Image
						src={product.thumbnail}
						alt={product.name}
						fill
						className='rounded-lg shadow-sm border border-slate-200 object-cover mix-blend-multiply'
					/>
				</div>
				<div className='mt-2 text-sm font-semibold text-slate-800'>
					{product.name}
				</div>
			</div>

			{/* User Info (looped) */}
			<div className='border-t pt-3 border-slate-200'>
				{userInfo.map((item, index) => (
					<InfoItem
						key={index}
						icon={item.icon}
						label={item.label}
						value={item.value}
					/>
				))}
			</div>

			{/* Status */}
			<div className='flex flex-col gap-2 border-t pt-3 border-slate-200'>
				<div className='flex justify-between items-center'>
					<span className='text-xs text-slate-500 font-medium'>
						Order Status
					</span>
					<StatusBadge
						value={orderStatus}
						list={orderStatuses}
					/>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-xs text-slate-500 font-medium'>
						Payment Status
					</span>
					<StatusBadge
						value={paymentStatus}
						list={paymentStatuses}
					/>
				</div>
			</div>
		</div>
	);
};

export default OrderInfo;
