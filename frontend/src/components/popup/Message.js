"use client";
import React from "react";
import { CircleCheck, CircleX } from "lucide-react";
import { motion } from "framer-motion";

const Message = ({
	message,
	position = "absolute",
	classes = "",
	type = "success",
}) => {
	return (
		<motion.div
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -20, opacity: 0 }}
			transition={{ duration: 0.3 }}
			className={
				classes
					? classes
					: `flex items-center h-10 justify-center gap-2 ${
							type === "error"
								? "bg-red-100"
								: "bg-purple-100"
					  } w-full  ${position} z-50 rounded-md shadow`
			}>
			{type === "error" ? (
				<CircleX className='size-5 text-red-500' />
			) : (
				<CircleCheck className='size-5 text-purple-500' />
			)}
			<span
				className={`text-sm font-medium text-nowrap ${
					type === "error"
						? "text-red-600"
						: "text-purple-600"
				}`}>
				{message}
			</span>
		</motion.div>
	);
};

export default Message;
