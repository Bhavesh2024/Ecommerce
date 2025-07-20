"use client";
import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/layout/navbar/Navbar";
import { sharedStyles } from "@/utils/helper/styles";
import { terms } from "@/utils/helper/termPolicy";
import {
	HelpSectionLoader,
	TermNavigationLoader,
	TermSectionLoader,
} from "@/components/loader/TermSectionLoader";

const TermSection = dynamic(
	() =>
		import("@/components/section/TermPolicy").then(
			(mod) => mod.TermSection,
		),
	{
		ssr: false,
		loading: () => <TermSectionLoader />,
	},
);

const TermNavigation = dynamic(
	() =>
		import("@/components/section/TermPolicy").then(
			(mod) => mod.TermNavigation,
		),
	{
		ssr: false,
		loading: () => <TermNavigationLoader />,
	},
);

const HelpSection = dynamic(
	() =>
		import("@/components/section/TermPolicy").then(
			(mod) => mod.HelpSection,
		),
	{
		ssr: false,
		loading: () => <HelpSectionLoader />,
	},
);

const TermsAndConditions = () => {
	const [expandedSections, setExpandedSections] = useState([]);

	const toggleSection = useCallback((index) => {
		setExpandedSections((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index],
		);
	}, []);

	const renderPoint = useCallback((point, idx) => {
		if (typeof point === "string") {
			return (
				<li
					key={idx}
					className={sharedStyles.listItem}>
					<span className='flex-1 text-gray-700 leading-relaxed'>
						{point}
					</span>
				</li>
			);
		}

		if (point.heading) {
			return (
				<div
					key={idx}
					className='mt-3 mb-2'>
					<h4 className='font-medium text-gray-900'>
						{point.heading}
					</h4>
					<ul className='mt-2 space-y-2 pl-5'>
						{point.subpoints.map((subpoint, subIdx) => {
							if (typeof subpoint === "string") {
								return (
									<li
										key={subIdx}
										className="text-gray-700 before:content-['–'] before:mr-2 before:text-gray-400">
										{subpoint}
									</li>
								);
							}
							if (subpoint.list) {
								return (
									<ul
										key={subIdx}
										className='space-y-1 pl-5'>
										{subpoint.list.map(
											(
												item,
												itemIdx,
											) => (
												<li
													key={
														itemIdx
													}
													className="text-gray-700 before:content-['•'] before:mr-2 before:text-purple-500">
													{
														item
													}
												</li>
											),
										)}
									</ul>
								);
							}
							return null;
						})}
					</ul>
				</div>
			);
		}

		if (point.list) {
			return (
				<ul
					key={idx}
					className='space-y-2 pl-5 mb-3'>
					{point.list.map((item, itemIdx) => (
						<li
							key={itemIdx}
							className="text-gray-700 before:content-['•'] before:mr-2 before:text-purple-500">
							{item}
						</li>
					))}
				</ul>
			);
		}

		return (
			<li
				key={idx}
				className={`${sharedStyles.listItem} ${
					point.note ? sharedStyles.noteBox : ""
				}`}>
				<span
					className={`flex-1 ${
						point.important
							? sharedStyles.importantText
							: "text-gray-700"
					}`}>
					{point.text}
				</span>
			</li>
		);
	}, []);

	return (
		<>
			<div className='fixed w-full top-0 start-0 z-20'>
				<Navbar />
			</div>

			<div className='w-full min-h-screen pt-24 pb-12'>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					{/* Hero Section */}
					<div className='text-center mb-12'>
						<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							Terms & Policies
						</h1>
						<p className='text-gray-600 max-w-3xl mx-auto text-lg'>
							Welcome to Upsquare's Terms &
							Conditions. Please review these
							policies carefully as they outline
							your rights and responsibilities when
							using our platform.
						</p>
					</div>

					<TermNavigation
						terms={terms}
						expandedSections={expandedSections}
						toggleSection={toggleSection}
					/>

					{/* Terms Sections */}
					<div className='max-w-4xl mx-auto space-y-4'>
						{terms.map((section, index) => (
							<TermSection
								key={index}
								section={section}
								isExpanded={expandedSections.includes(
									index,
								)}
								onToggle={() =>
									toggleSection(index)
								}
								renderPoint={renderPoint}
							/>
						))}
					</div>

					<HelpSection />
				</div>
			</div>
		</>
	);
};

export default TermsAndConditions;
