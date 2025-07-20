import React from "react";

const PurchaseSummary = ({
	variantTotal,
	discountAmount,
	extrasTotal,
	quantity,
	total,
}) => {
	return (
		<>
			<div className='p-4 border border-slate-300 rounded bg-purple-50 text-sm'>
				<p className='flex justify-between items-center'>
					<span className='text-slate-600 font-medium'>
						Product Total
					</span>
					<span>₹{variantTotal.toLocaleString()}</span>
				</p>
				<p className='flex justify-between items-center'>
					<span className='text-slate-600 font-medium'>
						Discount
					</span>
					<span>
						-₹
						{discountAmount.toFixed(2)}
					</span>
				</p>
				<p className='flex justify-between items-center'>
					<span className='text-slate-600 font-medium'>
						Extras Total
					</span>
					<span>₹{extrasTotal.toLocaleString()}</span>
				</p>
				<p className='flex justify-between items-center'>
					<span className='text-slate-600 font-medium'>
						Quantity
					</span>
					<span>x{quantity}</span>
				</p>
				<hr className='my-2 border-purple-300' />
				<p className='flex justify-between '>
					<span className='font-medium text-neutral-600'>
						Total
					</span>
					<span>₹{(total * quantity).toFixed(2)}</span>
				</p>
			</div>
		</>
	);
};

export default PurchaseSummary;
