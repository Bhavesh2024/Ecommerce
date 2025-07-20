import React from "react";

const OrderStep = () => {
	return (
		<>
			<div className='bg-purple-50 p-3 rounded text-sm text-slate-800'>
				<p className='mb-1 font-semibold'>📦 Order Steps:</p>
				<ol className='list-decimal pl-5 space-y-1'>
					<li>Confirm your product and quantity.</li>
					<li>Choose extras (if any).</li>
					<li>Verify your contact and delivery info.</li>
					<li>Click "Pay Now" to proceed with Razorpay.</li>
					<li>Receive confirmation by email.</li>
				</ol>
			</div>
		</>
	);
};

export default OrderStep;
