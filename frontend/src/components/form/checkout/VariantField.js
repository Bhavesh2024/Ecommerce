import React from "react";

const VariantField = ({
	label,
	value,
	sku,
	formIndex,
	quantity,
	setFieldValue,
}) => {
	return (
		<>
			<div
				key={sku}
				className='border border-slate-300 p-3 rounded shadow-sm flex justify-between items-center'>
				<div>
					<p className='font-medium'>{label}</p>
					<p className='text-xs text-slate-500'>₹{value}</p>
				</div>
				<div className='flex items-center space-x-2'>
					<button
						type='button'
						className='px-2 py-1 bg-purple-200 rounded'
						onClick={() =>
							setFieldValue(
								`variants[${formIndex}].quantity`,
								Math.max(0, quantity - 1),
							)
						}>
						–
					</button>
					<span>{quantity}</span>
					<button
						type='button'
						className='px-2 py-1 bg-purple-200 rounded'
						onClick={() =>
							setFieldValue(
								`variants[${formIndex}].quantity`,
								quantity + 1,
							)
						}>
						+
					</button>
				</div>
			</div>
		</>
	);
};

export default VariantField;
