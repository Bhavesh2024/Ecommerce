"use client";

import { usePopupMessage } from "@/hooks/usePopupMessage";
import { handleOrder } from "@/utils/api/orderApi";
import { handlePayment } from "@/utils/api/paymentApi";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import PageLoader from "@/components/loader/PageLoader";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import RazorPay from "@/components/payment/RazorPay";
const Modal = dynamic(() => import("@/components/modal/Modal"), {
	ssr: false,
	loading: () => <PageLoader />,
});

const Response = dynamic(() => import("@/components/modal/response/Response"), {
	ssr: false,
	loading: () => <PageLoader />,
});

const CheckoutForm = ({ product, user = null }) => {
	const router = useRouter();
	const [quantity, setQuantity] = useState(1);
	const [paymentLoading, setPaymentLoading] = useState(false);
	const checkoutRef = useState(null);
	const [paymentPayload, setPaymentPayload] = useState(null);
	const [formValues, setFormValues] = useState(null);
	const [total, setTotal] = useState(0);
	const {
		isOpen,
		message,
		type,
		closePopup,
		showError,
		showSuccess,
		loading,
		startLoading,
	} = usePopupMessage();
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [paymentId, setPaymentId] = useState(null);
	const initialValues = {
		variants: product.prices.flatMap((group) =>
			group.variants.map((variant) => ({
				sku: variant.sku,
				quantity: 0,
				type: group.type,
			})),
		),
		extras: [],
		name: user?.name || "",
		email: user?.email || "",
		address: user?.address ? user?.address[0] : "",
	};

	const { mutate: orderMutation } = useMutation({
		mutationFn: handleOrder,
		onSuccess: (data) => {
			showSuccess(data.message);
			setTimeout(() => {
				router.push(`/my-orders`);
			}, 3000);
		},
		onError: (err) => {
			showError(err);
		},
	});

	const { mutate: razorpayMutation } = useMutation({
		mutationFn: handlePayment,
		onSuccess: (data) => {
			const { orderId, amount } = data;
			setFormValues({
				...formValues,
				orderId: orderId,
				amount: amount,
			});
			setPaymentLoading(false);
			setIsPaymentOpen(true);
		},
		onError: (err) => {
			setPaymentLoading(false);
			showError(err);
		},
	});

	const calculateTotal = (values) => {
		let variantTotal = 0;
		let totalUnits = 0;
		// console.log(values);

		if (!values.variants) {
			variantTotal = product.price;
		} else if (values.variants.length <= 0) {
			variantTotal = product.price;
		} else {
			values.variants.forEach(({ sku, quantity }) => {
				if (quantity > 0) {
					const variant = product.prices
						.flatMap((p) => p.variants)
						.find((v) => v.sku === sku);
					if (variant) {
						variantTotal += variant.value * quantity;
						totalUnits += quantity;
					}
				}
			});
		}

		const extrasTotalPerUnit = values.extras.reduce(
			(sum, extraName) => {
				const extra = product.extras.find(
					(e) => e.name === extraName,
				);
				return sum + parseFloat(extra?.price || 0);
			},
			0,
		);

		const extrasTotal = extrasTotalPerUnit * totalUnits;
		const discountAmount =
			(variantTotal * (product.discount || 0)) / 100;
		const total = variantTotal - discountAmount + extrasTotal;
		setTotal(total);
		return {
			variantTotal,
			extrasTotal,
			discountAmount,
			totalUnits,
			total,
		};
	};

	const handleCheckout = (values) => {
		const totals = calculateTotal(values);

		const selectedVariants = values.variants
			.filter((v) => v.quantity > 0)
			.map((v) => {
				const variant = product.prices
					.flatMap((p) => p.variants)
					.find((pv) => pv.sku === v.sku);
				return {
					sku: variant?.sku,
					label: variant?.label,
					value: variant?.value,
					quantity: v.quantity,
				};
			});

		const selectedExtras = values.extras.map((extraName) => {
			const extra = product.extras.find(
				(e) => e.name === extraName,
			);
			return {
				name: extra?.name,
				price: parseFloat(extra?.price || 0),
			};
		});

		const payload = {
			product: {
				id: product.id,
				slug: product.slug,
				name: product.name,
				discount: product.discount || 0,
				stockCount: product.stockCount,
			},
			user: {
				id: user.id,
				phone: user.phone,
				name: values.name,
				email: values.email,
				address: values.address,
			},
			order: {
				variants: selectedVariants,
				extras: selectedExtras,
				quantity,
				totals,
			},
			payment: {
				paymentId: values.paymentId,
				receipt: values.receipt,
			},
		};
		startLoading();
		setIsPaymentOpen(false);
		orderMutation({
			method: "post",
			type: "add",
			data: { ...payload },
		});
		console.log("Final Checkout Payload:", payload);
		// Send to API here
	};

	useEffect(() => {
		if (paymentId) {
			handleCheckout({ ...formValues, paymentId });
		}
	}, [paymentId]);
	useEffect(() => {
		if (
			!user.address ||
			(Array.isArray(user?.address) && user?.length)
		) {
			alert("Please Update Address in Your Profile");
		}
	}, []);
	return (
		<div className='w-11/12 md:w-10/12 lg:w-4/5 xl:w-3/4 mx-auto p-3 md:p-6 bg-white rounded lg:shadow'>
			<h2 className='text-lg text-slate-900 font-medium mb-4'>
				{product.name}
			</h2>

			<Formik
				initialValues={initialValues}
				onSubmit={(values) => {
					if (!total) {
						alert("No Product Selected");
						return;
					}
					if (total >= 99999) {
						alert(
							"Payments above ₹99,999 are not accepted on our platform. Please reduce your order amount to proceed.",
						);
						return;
					}

					const payload = {
						amount: Math.round(total * quantity) * 100,
						currency: "INR",
					};
					setPaymentLoading(true);
					razorpayMutation({
						method: "post",
						type: "checkout",
						data: {
							...payload,
						},
					});

					setFormValues(values);
				}}>
				{({ values, setFieldValue }) => {
					const totals = calculateTotal(values);

					return (
						<Form className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* LEFT SIDE: Item Details + Summary */}
							<div className='space-y-6'>
								{/* Product Price (if no variants) */}
								{(!product.prices ||
									product.prices.length <=
										0) && (
									<div>
										<label className='block font-medium text-sm text-slate-600 mb-1'>
											Price
										</label>
										<Field
											type='text'
											name='defaultPrice'
											placeholder='Price'
											value={
												product.price
											}
											className='border border-slate-300 p-2 w-full rounded'
											required
										/>
									</div>
								)}

								{/* Variants & Quantity Controls */}
								{product.prices.map(
									(group, groupIdx) => (
										<div key={groupIdx}>
											<h3 className='text-sm font-semibold text-slate-700 mb-2'>
												{
													group.type
												}
											</h3>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												{group.variants.map(
													(
														variant,
													) => {
														const formIndex =
															values.variants.findIndex(
																(
																	v,
																) =>
																	v.sku ===
																	variant.sku,
															);
														const quantity =
															values
																.variants[
																formIndex
															]
																.quantity;

														return (
															<div
																key={
																	variant.sku
																}
																className='border border-slate-300 p-3 rounded shadow-sm flex justify-between items-center'>
																<div>
																	<p className='font-medium'>
																		{
																			variant.label
																		}
																	</p>
																	<p className='text-xs text-slate-500'>
																		₹
																		{
																			variant.value
																		}
																	</p>
																</div>
																<div className='flex items-center space-x-2'>
																	<button
																		type='button'
																		className='px-2 py-1 bg-purple-200 rounded'
																		onClick={() =>
																			setFieldValue(
																				`variants[${formIndex}].quantity`,
																				Math.max(
																					0,
																					quantity -
																						1,
																				),
																			)
																		}>
																		–
																	</button>
																	<span>
																		{
																			quantity
																		}
																	</span>
																	<button
																		type='button'
																		className='px-2 py-1 bg-purple-200 rounded'
																		onClick={() =>
																			setFieldValue(
																				`variants[${formIndex}].quantity`,
																				quantity +
																					1,
																			)
																		}>
																		+
																	</button>
																</div>
															</div>
														);
													},
												)}
											</div>
										</div>
									),
								)}

								{/* Extras */}
								{product.extras?.length > 0 && (
									<div>
										<label className='block text-sm text-slate-600 font-medium mb-2'>
											Extras
										</label>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
											{product.extras.map(
												(
													extra,
													idx,
												) => (
													<label
														key={
															idx
														}
														className='flex items-center gap-2 border border-slate-300 rounded p-2'>
														<Field
															type='checkbox'
															name='extras'
															value={
																extra.name
															}
														/>
														<span className='text-sm'>
															{
																extra.name
															}{" "}
															-
															₹
															{parseFloat(
																extra.price,
															).toLocaleString()}
														</span>
													</label>
												),
											)}
										</div>
									</div>
								)}

								{/* Quantity */}
								<div>
									<label className='block font-medium text-sm text-slate-600 mb-2'>
										Bundle
									</label>
									<input
										type='number'
										min='1'
										value={quantity}
										onChange={(e) =>
											setQuantity(
												Number(
													e
														.target
														.value,
												),
											)
										}
										className='border border-slate-300 focus:outline-purple-400 p-2 w-full rounded'
									/>
								</div>

								{/* Order Summary */}
								<div className='p-4 border border-slate-300 rounded bg-purple-50 text-sm'>
									<p className='flex justify-between items-center'>
										<span className='text-slate-600 font-medium'>
											Product Total
										</span>
										<span>
											₹
											{totals.variantTotal.toLocaleString()}
										</span>
									</p>
									<p className='flex justify-between items-center'>
										<span className='text-slate-600 font-medium'>
											Discount
										</span>
										<span>
											-₹
											{totals.discountAmount.toFixed(
												2,
											)}
										</span>
									</p>
									<p className='flex justify-between items-center'>
										<span className='text-slate-600 font-medium'>
											Extras Total
										</span>
										<span>
											₹
											{totals.extrasTotal.toLocaleString()}
										</span>
									</p>
									<p className='flex justify-between items-center'>
										<span className='text-slate-600 font-medium'>
											Quantity
										</span>
										<span>
											x{quantity}
										</span>
									</p>
									<hr className='my-2 border-purple-300' />
									<p className='flex justify-between '>
										<span className='font-medium text-neutral-600'>
											Total
										</span>
										<span>
											₹
											{(
												totals.total *
												quantity
											).toFixed(2)}
										</span>
									</p>
								</div>
							</div>
							{/* RIGHT SIDE: Customer Info + Razorpay + Notes */}
							<div className='flex flex-col  gap-4'>
								{/* Customer Info */}
								<div className='space-y-3'>
									{/* Contact Info */}
									<div className='grid grid-cols-1 gap-3'>
										<div>
											<label className='block text-sm font-medium text-slate-700 mb-1'>
												Full
												Name
											</label>
											<Field
												type='text'
												name='name'
												className='border border-slate-300 p-2 w-full rounded text-sm'
												readOnly
												required
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-slate-700 mb-1'>
												Email
											</label>
											<Field
												type='email'
												name='email'
												className='border border-slate-300 p-2 w-full rounded text-sm'
												readOnly
												required
											/>
										</div>
									</div>

									{/* Address */}
									<div>
										<label className='block text-sm font-medium text-slate-700 mb-1'>
											Address
										</label>
										<Field
											as='select'
											name='address'
											required
											className='border border-slate-300 p-2 w-full rounded text-sm'>
											<option value=''>
												Select
												Address
											</option>
											{user?.address?.map(
												(
													addr,
													index,
												) => (
													<option
														key={
															index
														}
														value={
															addr
														}>
														{
															addr
														}
													</option>
												),
											)}
										</Field>
									</div>
									{/* Razorpay + Notes + Submit */}

									{/* Payment Method */}
									<div>
										<label className='block text-sm font-medium text-slate-800 mb-1'>
											Payment Option
										</label>
										<div className='flex items-center gap-3 p-3 rounded bg-white'>
											<div className='flex items-center gap-2'>
												<img
													src='/images/logo/razorpay.svg'
													alt='Razorpay'
													className='h-6 w-auto object-contain'
												/>
											</div>
										</div>
									</div>

									{/* Purchase Notes */}
									<div className='bg-purple-50 p-3 rounded text-sm text-slate-800'>
										<p className='mb-1 font-semibold'>
											📦 Order
											Steps:
										</p>
										<ol className='list-decimal pl-5 space-y-1'>
											<li>
												Confirm
												your
												product
												and
												quantity.
											</li>
											<li>
												Choose
												extras
												(if
												any).
											</li>
											<li>
												Verify
												your
												contact
												and
												delivery
												info.
											</li>
											<li>
												Click
												"Pay
												Now" to
												proceed
												with
												Razorpay.
											</li>
											<li>
												Receive
												confirmation
												by
												email.
											</li>
										</ol>
									</div>
								</div>

								{/* Submit Button */}
								<div className='text-center pt-2'>
									<input
										type='submit'
										ref={checkoutRef}
										value='Place Order'
										className='bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-600 cursor-pointer text-sm w-full'
									/>
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						type={type}
						message={message}
						onClose={closePopup}
					/>
				)}
			</Modal>
			<Modal
				open={isPaymentOpen || paymentLoading}
				onClose={() => setIsPaymentOpen(false)}>
				{paymentLoading && <PageLoader />}

				<AnimatePresence>
					{isPaymentOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.2 }}
							className='bg-white w-[90vw] max-w-sm p-4 rounded-md shadow-lg relative flex flex-col justify-between gap-4'>
							{/* Close Button */}
							<X
								onClick={() =>
									setIsPaymentOpen(false)
								}
								className='absolute top-3 right-3 size-5 text-slate-500 cursor-pointer hover:text-slate-700'
							/>

							{/* Header */}
							<div>
								<h2 className='text-lg font-semibold text-slate-800 flex items-center gap-2'>
									Pay Via
									<img
										src='/images/logo/razorpay.svg'
										alt='Razorpay'
										className='h-6 object-contain'
									/>
								</h2>
								<p className='text-sm text-slate-600 mt-2'>
									Quick and secure —
									complete your payment now
									using Razorpay to confirm
									your order.
								</p>
							</div>

							{/* Payment Button */}
							<div className='mt-2 mx-auto'>
								<RazorPay
									amount={total * 100}
									user={user}
									title='Pay Now'
									order={formValues}
									paymentExtract={
										setPaymentId
									}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</Modal>
		</div>
	);
};

export default CheckoutForm;
