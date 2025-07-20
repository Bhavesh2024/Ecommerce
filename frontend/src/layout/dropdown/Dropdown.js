"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
const Dropdown = ({
	isOpen,
	setIsOpen,
	items,
	position = "right",
	width = "w-40",
	className = "",
}) => {
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setIsOpen]);

	if (!isOpen) return null;

	return (
		<div
			ref={dropdownRef}
			className={`absolute ${
				position === "right" ? "right-0" : "left-0"
			} ${
				position === "center"
					? "left-1/2 transform -translate-x-1/2"
					: ""
			} top-full mt-2 ${width} min-w-28 bg-white text-black rounded shadow-lg z-20 ${className}`}>
			<div className='flex flex-col gap-1 text-start'>
				{items.map((item, index) => {
					if (item.type === "link") {
						return (
							<Link
								key={index}
								href={item.link}
								className={`${item.classes} w-full flex items-center gap-2 px-3 py-2`}
								onClick={item.onClick}>
								{item.icon && (
									<span className='flex-shrink-0'>
										{item.icon}
									</span>
								)}
								{item.title}
							</Link>
						);
					} else if (item.type === "button") {
						return (
							<button
								key={index}
								className={`${item.classes} w-full text-start flex items-center gap-2 px-3 py-2`}
								onClick={item.onClick}>
								{item.icon && (
									<span className='flex-shrink-0'>
										{item.icon}
									</span>
								)}
								{item.title}
							</button>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
};

export default Dropdown;
