// components/AlertModal.js
"use client";

export default function Alert({ isOpen, message, onConfirm, onCancel, title }) {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg px-2 h-[150px] w-[300px] shadow-xl flex flex-col gap-3 place-content-between py-3'>
				<h1 className='text-slate-900 text-lg font-semibold'>
					{title}
				</h1>
				<p className='text-sm mb-4'>{message}</p>
				<div className='flex justify-end gap-2 '>
					<button
						onClick={onCancel}
						className='px-3 py-1 rounded text-yes-500'>
						No
					</button>
					<button
						onClick={onConfirm}
						className='px-3 py-1 rounded text-red-500 '>
						Yes
					</button>
				</div>
			</div>
		</div>
	);
}
