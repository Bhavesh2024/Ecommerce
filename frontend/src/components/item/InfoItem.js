import React from "react";
const InfoItem = ({ icon: Icon, label, value }) => (
	<div className='flex items-start gap-3 py-2'>
		<Icon className='w-5 h-5 mt-1 text-purple-600' />
		<div>
			<div className='text-slate-500 text-xs'>{label}</div>
			<div className='text-slate-800 font-medium text-sm'>
				{value}
			</div>
		</div>
	</div>
);

export default InfoItem;
