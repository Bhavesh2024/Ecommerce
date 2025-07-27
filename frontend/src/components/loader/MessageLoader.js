"use client";
import React from "react";
import { motion } from "framer-motion";

const MessageLoader = ({ type = "success" }) => {
	return (
		// <motion.div
		// 	initial={{ y: -20, opacity: 0 }}
		// 	animate={{ y: 0, opacity: 1 }}
		// 	exit={{ y: -20, opacity: 0 }}
		// 	transition={{ duration: 0.3 }}
		// 	className={`flex items-center h-10 justify-center gap-2 ${
		// 		type === "error" ? "bg-red-100" : "bg-purple-100"
		// 	} w-full absolute z-50 rounded-md shadow animate-pulse`}>
		// 	{/* Icon Skeleton */}
		// 	<div
		// 		className={`size-5 rounded-full ${
		// 			type === "error" ? "bg-red-300" : "bg-purple-300"
		// 		}`}></div>

		// 	{/* Text Skeleton */}
		// 	<div
		// 		className={`h-4 w-32 rounded ${
		// 			type === "error" ? "bg-red-300" : "bg-purple-300"
		// 		}`}></div>
		// </motion.div>
		<></>
	);
};

export default MessageLoader;
