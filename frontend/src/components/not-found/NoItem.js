import { CircleX } from "lucide-react";
import React from "react";

const NoItem = ({ message, icon = null }) => {
	return (
		<>
			<div className='flex h-full w-full items-center justify-center flex-col gap-2'>
				{icon ? (
					icon
				) : (
					<CircleX className='size-24 text-red-500' />
				)}
				<span className='text-2xl font-semibold text-gray-500'>
					{message || "No Item Found"}
				</span>
			</div>
		</>
	);
};

export default NoItem;
