"use client";

import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Alert({ isOpen, title, message, onConfirm, onCancel }) {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					className='relative bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 flex flex-col gap-4'>
					{/* Close Icon */}
					<button
						onClick={onCancel}
						className='absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition'>
						<X className='size-5' />
					</button>

					{/* Alert Icon */}
					<div className='flex justify-center'>
						<AlertTriangle className='text-yellow-500 size-10' />
					</div>

					{/* Title */}
					<h2 className='text-center text-xl font-bold text-slate-800'>
						{title || "Confirm Action"}
					</h2>

					{/* Message */}
					<p className='text-center text-sm text-slate-600 leading-relaxed'>
						{message ||
							"Are you sure you want to proceed with this action?"}
					</p>

					{/* Buttons */}
					<div className='flex justify-center gap-4 mt-2'>
						<button
							onClick={onCancel}
							className='px-5 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-sm font-medium'>
							Cancel
						</button>
						<button
							onClick={onConfirm}
							className='px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition text-sm font-medium shadow-md'>
							Yes, Confirm
						</button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
