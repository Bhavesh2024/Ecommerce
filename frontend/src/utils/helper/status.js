export const orderStatuses = [
	{
		label: "Awaiting",
		value: 0,
		bg: "bg-sky-100",
		text: "text-sky-700",
	},
	{
		label: "Confirmed",
		value: 1,
		bg: "bg-blue-100",
		text: "text-blue-700",
	},
	{
		label: "Shipped",
		value: 2,
		bg: "bg-purple-100",
		text: "text-purple-700",
	},
	{
		label: "Delivered",
		value: 3,
		bg: "bg-green-100",
		text: "text-green-700",
	},
	{
		label: "Cancelled",
		value: 4,
		bg: "bg-red-100",
		text: "text-red-700",
	},
];
export const paymentStatuses = [
	{
		label: "Pending",
		value: 0,
		bg: "bg-yellow-100",
		text: "text-yellow-700",
	},
	{
		label: "Completed",
		value: 1,
		bg: "bg-green-100",
		text: "text-green-700",
	},
	{
		label: "Refund",
		value: 2,
		bg: "bg-red-100",
		text: "text-red-700",
	},
];

export const razorpayStatus = {
	created: 0, // Order created, no payment attempt yet
	pending: 1, // Payment initiated, awaiting user action
	authorized: 2, // Payment authorized (hold placed on funds)
	captured: 3, // Payment successfully captured (completed)
	refunded: 4, // Payment refunded (partial or full)
	failed: 5, // Payment attempt failed
	cancelled: 6, // Payment was cancelled or expired
};

export const refundStatus = {
	created: 0, // Refund created but not processed yet
	processed: 1, // Refund successfully processed
	failed: 2, // Refund attempt failed
};

export const requestStatus = {
	pending: 0, // Request has been created but not reviewed
	approved: 1, // Request is approved
	rejected: 2, // Request is rejected
	in_progress: 3, // Request is being processed
	completed: 4, // Request is successfully completed
	cancelled: 5, // Request was cancelled by user/system
	failed: 6, // Request failed due to system or validation error
	escalated: 7, // Request has been escalated to higher authority/admin
};
