import {
	FileText,
	CreditCard,
	Truck,
	Undo2,
	Lock,
	Package,
} from "lucide-react";
export const termIconClasses = "w-5 h-5 text-purple-600";
export const terms = [
	{
		title: "General Terms",
		icon: <FileText className={termIconClasses} />,
		summary: "Basic rules governing your use of our platform",
		points: [
			"Upsquare is a creative eCommerce platform specializing in artistic, personalized, and design-oriented products.",
			"Users must register with accurate personal information and accept our Terms and Policies to make purchases.",
			"Visitors can browse products, collections, and pricing without logging in, but registration is mandatory for placing orders.",
			"We may record user activity such as orders, cancellations, and queries to ensure better service and system improvements.",
		],
	},
	{
		title: "Payment Policy",
		icon: <CreditCard className={termIconClasses} />,
		summary: "How we handle transactions and refunds",
		points: [
			{
				text: "All online payments on Upsquare are securely processed through Razorpay, our authorized payment gateway.",
				important: true,
			},
			"We do not store or access sensitive financial data like card numbers, banking passwords, or UPI PINs.",
			"International transactions are currently not supported. We only accept domestic payments within India.",
			{
				heading: "Refund Conditions",
				subpoints: [
					"Order cancellation requested within 48 hours of purchase and before dispatch",
					"Refunds processed based on original payment method:",
					{
						list: [
							"UPI: 2–3 business days",
							"Credit/Debit Cards: 5–7 business days",
							"Wallets/Net Banking: 2–5 business days",
						],
					},
				],
			},
			"Partial payments or EMI options are not supported at this time. Full payment is required during checkout.",
		],
	},
	{
		title: "Product Usage",
		icon: <Package className={termIconClasses} />,
		summary: "How you can use our creative products",
		points: [
			"All products purchased from Upsquare are intended strictly for personal, non-commercial use.",
			"Reproduction, resale, modification, or unauthorized distribution of any product is prohibited unless prior written approval is obtained from Upsquare.",
		],
	},
	{
		title: "Order Fulfillment",
		icon: <Truck className={termIconClasses} />,
		summary: "How we process and deliver your orders",
		points: [
			"Order processing, dispatch, and delivery timelines depend on your shipping location, product category, and service availability.",
			"We strive to ship products in a timely manner, with estimated delivery timelines shared during checkout.",
			{
				text: "While we aim to fulfill orders promptly, exact delivery dates are not guaranteed, especially during peak seasons or unforeseen logistical delays.",
				note: true,
			},
		],
	},
	{
		title: "Cancellations & Refunds",
		icon: <Undo2 className={termIconClasses} />,
		summary: "Our policies on order changes and returns",
		points: [
			"Customers can request cancellation via our Contact Form within 48 hours of placing the order and before dispatch.",
			"Orders cannot be cancelled or refunded once the product is marked as dispatched or in transit.",
			"Refunds are processed only if cancellation request is valid and approved by our team.",
			"Refund timelines depend on your bank or card provider and Razorpay's processing schedule.",
		],
	},
	{
		title: "Privacy & Data Usage",
		icon: <Lock className={termIconClasses} />,
		summary: "How we handle your personal information",
		points: [
			"Upsquare collects only essential user data required to process orders and provide customer service:",
			{
				list: [
					"Name, gender, and birth date (for identity confirmation)",
					"Email address (for order confirmations and updates)",
					"Phone number (for delivery coordination)",
					"Shipping address (collected during checkout only)",
				],
			},
			"Your personal data is never sold, shared, or used for marketing without your consent.",
		],
	},
];
