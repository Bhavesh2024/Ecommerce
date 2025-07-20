"use client";
import React from "react";
import Link from "next/link";
import {
	emailAddress,
	phoneNumbers,
	location,
	socialMedia,
} from "@/utils/helper/web-content";
const Footer = () => {
	const [phoneNumber] = phoneNumbers;
	return (
		<footer className='bg-slate-200 text-neutral-700 mt-8 shadow'>
			<div className='max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8'>
				{/* Logo Section */}
				<div>
					<h1 className='text-3xl font-semibold font-logo text-neutral-900 mb-3'>
						Upsquare
					</h1>
					<p className='text-sm text-neutral-700'>
						Your trusted eCommerce partner for quality
						products.
					</p>
				</div>

				{/* Quick Links */}
				<div>
					<h2 className='text-lg font-semibold mb-3'>
						Quick Links
					</h2>
					<ul className='space-y-2'>
						<li>
							<Link
								href='/'
								className='hover:text-purple-500 transition'>
								Home
							</Link>
						</li>
						<li>
							<Link
								href='/contact'
								className='hover:text-purple-500 transition'>
								Contact
							</Link>
						</li>
						<li>
							<Link
								href='/term-condition'
								className='hover:text-purple-500 transition'>
								Term & Condition
							</Link>
						</li>
					</ul>
				</div>

				{/* Contact Info */}
				<div>
					<h2 className='text-lg font-semibold mb-3'>
						Contact Us
					</h2>
					<ul className='space-y-3 text-sm'>
						<li className='flex items-center gap-2 hover:text-purple-500'>
							<emailAddress.icon
								size={18}
								className=' hover:text-purple-500'
							/>
							{emailAddress.email}
						</li>
						<li className='flex items-center gap-2 hover:text-purple-500'>
							<phoneNumber.icon
								size={18}
								className=' hover:text-purple-500'
							/>
							{phoneNumber.countryCode}{" "}
							{phoneNumber.phone}
						</li>
						<li className='flex items-center gap-2 hover:text-purple-500'>
							<location.icon
								size={18}
								className=' hover:text-purple-500'
							/>
							{location.address}
						</li>
					</ul>
				</div>
				<div>
					<h2 className='text-lg font-semibold mb-3'>
						Follow Us
					</h2>
					<ul className='space-y-3 text-sm'>
						{socialMedia.map(
							(
								{ icon: Icon, link, name },
								index,
							) => (
								<Link
									href={link}
									target=' '
									className='flex items-center gap-2 hover:text-purple-500'>
									<Icon size={18} />
									{name}
								</Link>
							),
						)}
					</ul>
				</div>
			</div>

			{/* Bottom Copyright */}
			<div className='border-t border-gray-700 text-center py-4 text-sm'>
				© {new Date().getFullYear()} Upsquare. All rights
				reserved.
			</div>
		</footer>
	);
};

export default Footer;
