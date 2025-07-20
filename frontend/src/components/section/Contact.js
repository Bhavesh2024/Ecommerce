"use client";
import React, { useMemo } from "react";
import {
	emailAddress,
	location,
	phoneNumbers,
	workHours,
} from "@/utils/helper/web-content";
import dynamic from "next/dynamic";
import { InfoCardLoader } from "../loader/CardLoader";

const InfoCard = dynamic(() => import("../card/InfoCard"), {
	loading: () => <InfoCardLoader />,
	ssr: false,
});

const Contact = () => {
	const [primaryPhone] = phoneNumbers;

	const contactItems = useMemo(
		() => [
			{
				icon: location.icon,
				title: "Our Location",
				content: (
					<a
						href={location.link}
						className='hover:text-purple-600 transition-colors'>
						{location.address}
					</a>
				),
			},
			{
				icon: emailAddress.icon,
				title: "Email Us",
				content: (
					<a
						href={emailAddress.link}
						className='hover:text-purple-600 transition-colors'>
						{emailAddress.email}
					</a>
				),
			},
			{
				icon: primaryPhone.icon,
				title: "Call/Text",
				content: (
					<>
						{phoneNumbers.map(
							({ phone, countryCode }, idx) => (
								<div
									key={`${countryCode}-${phone}`}>
									{countryCode} {phone}
								</div>
							),
						)}
						<div className='mt-1 text-sm'>
							{workHours.weekdays}
						</div>
					</>
				),
			},
		],
		[primaryPhone.icon],
	);

	return (
		<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 text-center'>
			{contactItems.map((item, index) => (
				<InfoCard
					key={`contact-${index}`}
					Icon={item.icon}
					title={item.title}
					content={item.content}
				/>
			))}
		</div>
	);
};

export default Contact;
