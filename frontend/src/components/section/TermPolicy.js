"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InfoCardLoader } from "../loader/CardLoader";
import { sharedStyles } from "@/utils/helper/styles";
const Contact = dynamic(() => import("@/components/section/Contact"), {
	loading: () => <InfoCardLoader />,
	ssr: false,
});

export const HelpSection = () => {
	return (
		<div className='max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100'>
			<div className='text-center'>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>
					Need Help Understanding Our Terms?
				</h2>
				<p className='text-gray-600 mb-6 max-w-2xl mx-auto'>
					Our support team is happy to clarify any part of
					our terms and conditions. Contact us if you have
					questions about your rights, responsibilities, or
					any policy.
				</p>
				<div className='flex justify-center'>
					<Link
						href='/contact'
						className={sharedStyles.btnPrimary}>
						Contact Support
					</Link>
				</div>
			</div>
			<div className='mt-8'>
				<Contact />
			</div>
		</div>
	);
};

export const TermNavigation = ({ terms, expandedSections, toggleSection }) => {
	return (
		<div className='max-w-4xl mx-auto mb-8 hidden md:block'>
			<div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					Quick Navigation
				</h3>
				<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
					{terms.map((section, index) => (
						<button
							key={index}
							onClick={() => toggleSection(index)}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
								expandedSections.includes(index)
									? "bg-purple-50 text-purple-700"
									: "hover:bg-gray-50"
							}`}>
							{section.icon}
							<span className='text-sm font-medium'>
								{section.title}
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export const TermSection = ({ section, isExpanded, onToggle, renderPoint }) => {
	return (
		<div className='bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-100'>
			<button
				onClick={onToggle}
				className='w-full flex justify-between items-center p-6 text-left focus:outline-none'>
				<div className='flex items-center gap-4'>
					<div className='p-2 bg-purple-50 rounded-lg'>
						{section.icon}
					</div>
					<div className='text-left'>
						<h2 className='text-xl font-semibold text-gray-800'>
							{section.title}
						</h2>
						<p className='text-sm text-gray-500 mt-1'>
							{section.summary}
						</p>
					</div>
				</div>
				{isExpanded ? (
					<ChevronUp className='w-5 h-5 text-purple-600' />
				) : (
					<ChevronDown className='w-5 h-5 text-purple-600' />
				)}
			</button>

			{isExpanded && (
				<div className='px-6 pb-6 pt-2 border-t border-gray-100'>
					<ul className='space-y-3'>
						{section.points.map((point, idx) =>
							renderPoint(point, idx),
						)}
					</ul>
				</div>
			)}
		</div>
	);
};
