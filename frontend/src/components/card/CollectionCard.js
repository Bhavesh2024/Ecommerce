import React from "react";

const CollectionCard = ({ Icon, name, desc, index }) => {
	return (
		<>
			<div
				key={index}
				className='bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
				<div className='flex items-center mb-3'>
					<Icon className='w-6 h-6 text-purple-600 mr-3' />
					<h3 className='text-xl font-medium text-gray-800'>
						{name}
					</h3>
				</div>
				<p className='text-gray-600 text-sm'>{desc}</p>
			</div>
		</>
	);
};

export default CollectionCard;
