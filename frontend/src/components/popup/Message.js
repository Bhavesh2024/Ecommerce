"use client";
import React from "react";
import { CircleCheck, CircleX } from "lucide-react";
const Message = ({ message, position = "absolute", classes = "", type }) => {
	console.log(message);
	return (
		<div
			className={
				classes
					? classes
					: `flex items-center h-10 justify-center gap-1 bg-indigo-100 w-11/12 md:w-10/12 lg:w-full ${position} top-0 rounded-md`
			}>
			{type == "error" ? (
				<CircleX className='size-5 text-red-500' />
			) : (
				<CircleCheck className='size-5 text-emerald-400' />
			)}
			<span
				className={` text-sm ${
					type == "error"
						? "text-red-500"
						: "text-emerald-500"
				}`}>
				{message}
			</span>
		</div>
	);
};

export default Message;
