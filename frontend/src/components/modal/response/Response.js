import { CircleCheck, CircleX } from "lucide-react";
import React from "react";

const Response = ({ type, message, onClose }) => {
	return (
		<div className='fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg  px-2 h-[200px] w-[300px] shadow-xl flex flex-col gap-4 items-center justify-center py-3'>
				{type == "error" && (
					<CircleX className='size-24 text-red-500' />
				)}
				{type == "success" && (
					<CircleCheck className='size-24 text-emerald-500' />
				)}
				<p
					className={`${
						type == "error"
							? "text-red-500"
							: "text-emerald-400"
					}`}>
					{message}
				</p>
				<button
					className={`h-12 w-16 text-white rounded-md ${
						type == "error"
							? "bg-red-500"
							: "bg-emerald-400"
					} flex items-center justify-center font-semibold`}
					onClick={onClose}>
					OK
				</button>
			</div>
		</div>
	);
};

export default Response;
