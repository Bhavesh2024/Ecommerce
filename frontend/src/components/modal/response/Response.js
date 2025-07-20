"use client";
import { CircleCheck, CircleX } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Response = ({ type, message, onClose }) => {
	return (
		<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.3 }}
				className='bg-white rounded-xl px-4 py-6 w-[320px] h-[240px] shadow-2xl flex flex-col items-center justify-between'>
				{type === "error" && (
					<CircleX className='size-20 text-red-500 bg-red-100 p-2 rounded-full' />
				)}
				{type === "success" && (
					<CircleCheck className='size-20 text-purple-500 bg-purple-100 p-2 rounded-full' />
				)}

				<p
					className={`text-lg font-semibold ${
						type === "error"
							? "text-red-500"
							: "text-purple-500"
					}`}>
					{type === "error" ? "Sorry :(" : "Success!"}
				</p>

				<p className='text-gray-600 text-center text-sm px-2'>
					{message}
				</p>

				<button
					onClick={onClose}
					className={`h-10 w-28 mt-3 rounded-full text-white text-sm font-medium ${
						type === "error"
							? "bg-red-500"
							: "bg-purple-500"
					} hover:opacity-90`}>
					{type === "error" ? "TRY AGAIN" : "OKAY"}
				</button>
			</motion.div>
		</div>
	);
};

export default Response;
