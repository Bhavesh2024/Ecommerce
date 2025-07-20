// components/RazorpayButton.js

import { handlePayment } from "@/utils/api/paymentApi";
import { useMutation } from "@tanstack/react-query";

export default function RazorPay({
	amount = 0,
	user = null,
	order = null,
	currency = "INR",
	title = "Pay Now",
	paymentExtract = null,
}) {
	const loadRazorpayScript = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};
	const handleRazorpay = async () => {
		const res = await loadRazorpayScript();
		if (!res) {
			alert("Failed to load Razorpay");
			return;
		}
		const options = {
			key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
			amount: order.amount,
			orderId: order.orderId,
			currency: currency,
			name: "Upsquare",
			handler: function (response) {
				const { razorpay_payment_id } = response;
				console.log("payresponse", response);
				paymentExtract(razorpay_payment_id);
			},
			prefill: {
				name: user?.name,
				email: user?.email,
				contact: user?.phone,
			},
			notes: {
				address: user?.address,
			},
			theme: {
				color: "#3399cc",
			},
		};

		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	};

	return (
		<button
			type='button'
			onClick={handleRazorpay}
			className='px-4 py-2 bg-purple-700 hover:bg-purple-500 text-white rounded'>
			{title}
		</button>
	);
}
