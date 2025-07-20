import React from "react";

const InfoCard = ({ Icon, title, content }) => (
	<div className='bg-white p-6 rounded-lg'>
		<Icon className='w-8 h-8 text-purple-600 mx-auto mb-3' />
		<h3 className='font-medium text-gray-800 mb-1'>{title}</h3>
		<div className='text-gray-600 text-sm text-center'>{content}</div>
	</div>
);
export default InfoCard;
