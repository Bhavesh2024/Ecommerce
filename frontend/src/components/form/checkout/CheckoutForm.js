"use client";

import { usePopupMessage } from "@/hooks/usePopupMessage";
import Modal from "@/components/modal/Modal";
import Response from "@/components/modal/response/Response";
import { handleOrder } from "@/utils/api/orderApi";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CheckoutForm = ({ product, user = null }) => {
	const router = useRouter();
	const [quantity, setQuantity] = useState(1);
	const { isOpen, message, type, closePopup, showError, showSuccess } =
		usePopupMessage();
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
				router.push("/");
			}, 3000);
		},
		onError: (err) => {
			showError(err);
		},
	});

	const calculateTotal = (values) => {
		let variantTotal = 0;
		let totalUnits = 0;

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

		return {
			variantTotal,
			extrasTotal,
			discountAmount,
			totalUnits,
			total,
		};
	};

	return (
		<div className='max-w-3xl mx-auto p-6 bg-white rounded shadow'>
			<h2 className='text-xl text-neutral-900 font-bold mb-4'>
				Checkout - {product.name}
			</h2>

			<Formik
				initialValues={initialValues}
				onSubmit={(values) => {
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

					const selectedExtras = values.extras.map(
						(extraName) => {
							const extra = product.extras.find(
								(e) => e.name === extraName,
							);
							return {
								name: extra?.name,
								price: parseFloat(
									extra?.price || 0,
								),
							};
						},
					);

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
					};

					orderMutation({
						method: "post",
						type: "add",
						data: { ...payload },
					});
					console.log("Final Checkout Payload:", payload);
					// Send to API here
				}}>
				{({ values, setFieldValue }) => {
					const totals = calculateTotal(values);

					return (
						<Form className='space-y-4'>
							{product.prices.map(
								(group, groupIdx) => (
									<div
										key={groupIdx}
										className='mb-4'>
										<h3 className='text-sm font-semibold text-gray-700 mb-2'>
											{group.type}
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
																<p className='text-xs text-gray-500'>
																	₹
																	{
																		variant.value
																	}
																</p>
															</div>

															<div className='flex items-center space-x-2'>
																<button
																	type='button'
																	className='px-2 py-1 bg-gray-200 rounded'
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
																	className='px-2 py-1 bg-gray-200 rounded'
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
									<label className='block text-sm text-gray-600 font-medium mb-2'>
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
								<label className='block font-medium text-sm text-gray-600 mb-2'>
									Quantity
								</label>
								<input
									type='number'
									min='1'
									value={quantity}
									onChange={(e) =>
										setQuantity(
											Number(
												e.target
													.value,
											),
										)
									}
									className='border border-slate-300 p-2 w-full rounded'
								/>
							</div>

							{/* Contact Info */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block font-medium text-sm text-gray-600 mb-1'>
										Full Name
									</label>
									<Field
										name='name'
										placeholder='Your Name'
										className='border border-slate-300 p-2 w-full rounded'
										required
									/>
								</div>
								<div>
									<label className='block font-medium text-sm text-gray-600 mb-1'>
										Email
									</label>
									<Field
										name='email'
										type='email'
										placeholder='you@example.com'
										className='border border-slate-300 p-2 w-full rounded'
										required
									/>
								</div>
							</div>
							<div>
								<label className='block font-medium text-sm text-gray-600 mb-1'>
									Address
								</label>
								<Field
									name='address'
									as='textarea'
									placeholder='Your Address'
									rows={3}
									required
									className='border border-slate-300 p-2 w-full rounded'
								/>
							</div>

							{/* Summary */}
							<div className='p-4 border border-slate-300 rounded bg-gray-50 text-sm'>
								<p className='flex justify-between items-center'>
									<span className='text-gray-600 font-medium'>
										Product Total
									</span>{" "}
									<span>
										₹
										{totals.variantTotal.toLocaleString()}
									</span>
								</p>
								<p className='flex justify-between items-center'>
									<span className='text-gray-600 font-medium'>
										Discount
									</span>{" "}
									<span>
										-₹
										{totals.discountAmount.toFixed(
											2,
										)}
									</span>
								</p>
								<p className='flex justify-between items-center'>
									<span className='text-gray-600 font-medium'>
										Extras Total
									</span>{" "}
									<span>
										₹
										{totals.extrasTotal.toLocaleString()}
									</span>
								</p>
								<p className='flex justify-between items-center'>
									<span className='text-gray-600 font-medium'>
										Quantity
									</span>{" "}
									<span>x{quantity}</span>
								</p>
								<hr className='my-2 border-slate-300' />
								<p className='flex justify-between '>
									<span className='font-medium text-neutral-600'>
										Total
									</span>{" "}
									<span>
										₹
										{totals.total *
											quantity}
									</span>
								</p>
							</div>

							<button
								type='submit'
								className='bg-neutral-900 mx-auto flex text-white px-6 py-2 rounded hover:bg-blue-700'>
								Confirm Order
							</button>
						</Form>
					);
				}}
			</Formik>
			<Modal
				open={isOpen}
				onClose={closePopup}>
				<Response
					type={type}
					message={message}
					onClose={closePopup}
				/>
			</Modal>
		</div>
	);
};

export default CheckoutForm;
