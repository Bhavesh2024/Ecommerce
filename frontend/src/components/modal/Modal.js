"use client";

import React from "react";
import { createPortal } from "react-dom";
const Modal = ({ open, onClose, children }) => {
	if (!open) return null; // Prevents unnecessary rendering

	return createPortal(
		<div
			className='flex gap-1 p-4  justify-center min-h-screen max-h-screen overflow-auto w-full bg-neutral-800/40 fixed z-40 top-0 start-0'
			onClick={onClose}>
			<div
				onClick={(e) => e.stopPropagation()}
				className='w-fit min-h-[90vh] flex items-center justify-center h-fit overflow-auto'>
				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
