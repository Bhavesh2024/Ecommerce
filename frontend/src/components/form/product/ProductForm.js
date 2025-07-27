"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Plus, Trash, Upload, X, ChevronDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { handleProduct } from "@/utils/api/productApi";
import { useAdminStoreActions } from "@/hooks/store/useAdminStore";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import Modal from "@/components/modal/Modal";
import PageLoader from "@/components/loader/PageLoader";
import Response from "@/components/modal/response/Response";
import { useParams, useRouter } from "next/navigation";
import { categories } from "@/utils/helper/category";

const ProductForm = ({ action = "add", data = null, onClose }) => {
	const imageRef = useRef();
	const [responseImages, setResponseImages] = useState([]);
	const router = useRouter();
	const { role } = useParams();
	const [formValues, setFormValues] = useState(null);

	const {
		message,
		showError,
		showSuccess,
		isOpen,
		closePopup,
		type,
		loading,
		startLoading,
	} = usePopupMessage();
	// Art & Design related categories
	const initialValues = {
		title: data ? data.name : "",
		category: data ? data.category : "",
		description: data ? data.description : "",
		defaultPrice: data ? data.price : "",
		prices: data ? data.prices : [],
		extras: data ? data.extras : [],
		images: data ? data.images : [],
		discount: data ? data.discount : "",
		stockCount: data ? data.stockCount : "",
		stockStatus: data ? data.stockStatus : 0,
		slug: data ? data.slug : "",
		status: data ? data.status : false,
	};

	const { addItem, updateItem } = useAdminStoreActions();

	const {
		mutate: productMutation,
		isPending: isPendingProduct,
		isSuccess: isSuccessProduct,
	} = useMutation({
		mutationFn: handleProduct,
		onSuccess: function (response) {
			if (Array.isArray(response) && response.length > 0) {
				setResponseImages(response);
			} else {
				showSuccess(response.message);
				setTimeout(() => {
					router.push(`/user/${role}/products`);
				}, 3000);
				action == "add"
					? addItem("products", response.product)
					: updateItem("products", response.product);
			}
		},
		onError: function (err) {
			showError(err);
		},
	});

	const validationSchema = Yup.object({
		title: Yup.string().required("Product Name is required"),
		category: Yup.string().required("Category is required"),
		description: Yup.string()
			.required("Description is required")
			.max(300, "Maximum size reached"),
		defaultPrice: Yup.number().required("Default Price is required"),
		prices: Yup.array().of(
			Yup.object({
				type: Yup.string().required("Type is required"),
				variants: Yup.array().of(
					Yup.object({
						label: Yup.string().required(),
						value: Yup.number()
							.typeError("Must be a number")
							.required("Required"),
					}),
				),
			}),
		),
		images: Yup.array()
			.min(1, "At least one image is required")
			.max(5, "No more than 5 images allowed"),
		extras: Yup.array().of(
			Yup.object({
				name: Yup.string().required("Required"),
				price: Yup.number()
					.typeError("Must be a number")
					.required("Required"),
			}),
		),
		discount: Yup.number()
			.typeError("Must be a number")
			.min(0)
			.max(100),
		stockCount: Yup.number()
			.typeError("Must be a number")
			.required("Required"),
		stockStatus: Yup.number().required("Required"),
	});

	const generateSlug = (title) => {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	};

	function generateSKUs(productName, prices) {
		const productSlug = productName.replace(/\s+/g, "").toUpperCase();

		const skus = [];

		prices.forEach((group) => {
			const type = group.type.toUpperCase();

			group.variants.forEach((variant) => {
				const label = variant.label
					.replace(/\s+/g, "-")
					.toUpperCase();

				const uniqueId = crypto
					.randomUUID()
					.split("-")[0]
					.toUpperCase(); // short UUID part

				skus.push({
					sku: `${productSlug}-${type}-${label}-${uniqueId}`,
					label: variant.label,
					value: Number(variant.value),
				});
			});
		});

		return skus;
	}

	useEffect(() => {
		if (isSuccessProduct && responseImages.length > 0 && formValues) {
			const formImages = formValues.images.map((image) => {
				const matchedResponseImage = responseImages.find(
					(resImage) => resImage.order == image.order,
				);

				if (matchedResponseImage) {
					return {
						...image,
						file: null,
						url: matchedResponseImage.url,
					};
				}

				return image;
			});
			setResponseImages(0);
			productMutation({
				method: action == "add" ? "post" : "put",
				type: action == "add" ? "add" : "update",
				data: {
					...formValues,
					images: formImages,
					oldSlug: data ? data.slug : null,
					id: data ? data.id : null,
				},
			});
		}
	}, [responseImages, isSuccessProduct, formValues]);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				closePopup();
			}, 3000);
		}
	}, [isOpen]);
	useEffect(() => {
		if (action === "edit" && data) {
			setFormValues({
				title: data.name || "",
				category: data.category || "",
				description: data.description || "",
				defaultPrice: data.price || "",
				prices: data.prices || [],
				extras: data.extras || [],
				images: data.images || [],
				discount: data.discount || 0,
				stockCount: data.stockCount || 0,
				stockStatus: data.stockStatus || 0,
				slug: data.slug || "",
				status: data.status || false,
			});
		}
	}, [action, data]);

	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				enableReinitialize={true}
				validateOnBlur={true}
				validateOnMount={false}
				validateOnChange={true}
				onSubmit={(values) => {
					values.slug = generateSlug(values.title);
					const skus = generateSKUs(
						values.slug,
						values.prices,
					);
					startLoading();
					let skuIndex = 0;
					const newProductPrices = values.prices.map(
						({ type, variants }) => {
							const updatedVariants = variants.map(
								() => skus[skuIndex++],
							);
							return {
								type,
								variants: updatedVariants,
							};
						},
					);
					const productImages = values.images
						.filter((image) => image.file) // keep only local uploaded files
						.map((image) => ({
							file: image.file,
							order: image.order,
						}));

					const formData = new FormData();
					if (
						Array.isArray(productImages) &&
						productImages.length > 0
					) {
						productImages.forEach(({ file, order }) => {
							formData.append("image", file);
							formData.append("order", order);
						});
						productMutation({
							method: "post",
							type: "upload",
							data: formData,
						});
					} else {
						productMutation({
							method:
								action == "add"
									? "post"
									: "put",
							type:
								action == "add"
									? "add"
									: "update",
							data: {
								...values,
								prices: newProductPrices,
								oldSlug: data
									? data.slug
									: null,
								id: data ? data.id : null,
							},
						});
						return;
					}
					setFormValues({
						...values,
						prices: newProductPrices,
						images: values.images,
					});
				}}>
				{({ values, errors, touched, setFieldValue }) => {
					return (
						<>
							<Form className='p-4 space-y-6 w-full mx-auto  rounded-lg'>
								<div className='space-y-4'>
									{/* Image Upload Section */}
									<div className='space-y-2'>
										<label className='block text-sm font-medium text-slate-700'>
											Product Images
										</label>
										<div
											className='flex flex-col gap-1 h-32 w-full border-2 border-dashed border-slate-300 rounded-lg justify-center items-center hover:border-purple-500 transition-colors cursor-pointer bg-white'
											onClick={() => {
												if (
													values
														.images
														.length <
													5
												) {
													imageRef.current.click();
												} else {
													showError(
														"Maximum 5 Images are allowed to upload",
													);
												}
											}}>
											<Upload className='size-8 text-purple-500' />
											<span className='text-sm text-slate-500'>
												Click to
												upload
												or drag
												and drop
											</span>
											<span className='text-xs text-slate-400'>
												{
													values
														.images
														.length
												}
												/5
												images
												uploaded
											</span>
										</div>
										<input
											type='file'
											accept='image/*'
											hidden
											ref={imageRef}
											multiple
											onChange={(
												event,
											) => {
												const selectedFiles =
													Array.from(
														event
															.target
															.files,
													);

												const currentCount =
													values
														.images
														.length;
												const allowedCount =
													5 -
													currentCount;

												if (
													allowedCount <=
													0
												) {
													alert(
														"You can upload a maximum of 5 images.",
													);
													return;
												}

												const filesToProcess =
													selectedFiles.slice(
														0,
														allowedCount,
													);

												const readers =
													filesToProcess.map(
														(
															file,
															index,
														) => {
															return new Promise(
																(
																	resolve,
																	reject,
																) => {
																	const reader =
																		new FileReader();
																	reader.onload =
																		() =>
																			resolve(
																				{
																					url: reader.result,
																					file: file,
																					label: "",
																					order:
																						currentCount +
																						index +
																						1,
																					isThumbnail: false,
																				},
																			);
																	reader.onerror =
																		reject;
																	reader.readAsDataURL(
																		file,
																	);
																},
															);
														},
													);

												Promise.all(
													readers,
												).then(
													(
														newImages,
													) => {
														setFieldValue(
															"images",
															[
																...values.images,
																...newImages,
															],
														);
													},
												);
											}}
										/>

										{values.images
											?.length >
											0 && (
											<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
												{values.images?.map(
													(
														img,
														i,
													) => (
														<div
															key={
																i
															}
															className='border border-slate-200 rounded-lg w-full relative bg-white group overflow-hidden'>
															<div className='relative'>
																<img
																	src={
																		img.url
																	}
																	alt={`img-${i}`}
																	className='h-40 w-full object-cover rounded-t-lg'
																/>

																{/* Thumbnail Toggle */}
																<div className='absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full'>
																	<input
																		type='radio'
																		name='thumbnail'
																		id={`thumbnail-${i}`}
																		checked={
																			values.images.some(
																				(
																					img,
																				) =>
																					img.isThumbnail,
																			)
																				? img.isThumbnail
																				: i ===
																				  0
																		}
																		onChange={() => {
																			const updatedImages =
																				values.images.map(
																					(
																						image,
																						index,
																					) => ({
																						...image,
																						isThumbnail:
																							index ===
																							i,
																					}),
																				);
																			setFieldValue(
																				"images",
																				updatedImages,
																			);
																		}}
																		className='text-purple-600 focus:ring-purple-500'
																	/>
																	<label
																		htmlFor={`thumbnail-${i}`}
																		className='text-xs text-slate-700 cursor-pointer'>
																		Thumbnail
																	</label>
																</div>
															</div>
															<div className='p-2 space-y-1'>
																<input
																	type='text'
																	placeholder='Image label'
																	value={
																		img.label
																	}
																	onChange={(
																		e,
																	) => {
																		const updatedImages =
																			[
																				...values.images,
																			];
																		updatedImages[
																			i
																		].label =
																			e.target.value;
																		setFieldValue(
																			"images",
																			updatedImages,
																		);
																	}}
																	className='text-sm w-full px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
																/>
																<input
																	type='number'
																	value={
																		img.order
																	}
																	onChange={(
																		e,
																	) => {
																		const updatedImages =
																			[
																				...values.images,
																			];
																		updatedImages[
																			i
																		].order =
																			parseInt(
																				e
																					.target
																					.value,
																			);
																		setFieldValue(
																			"images",
																			updatedImages,
																		);
																	}}
																	hidden
																	readOnly
																	min='1'
																	max='5'
																/>
															</div>

															{/* Remove Button */}
															<button
																type='button'
																onClick={() => {
																	const updatedImages =
																		[
																			...values.images,
																		];
																	updatedImages.splice(
																		i,
																		1,
																	);
																	setFieldValue(
																		"images",
																		updatedImages,
																	);
																}}
																className='absolute top-2 right-2 bg-slate-800/80 text-white p-1 rounded-full hover:bg-red-500 transition-colors'>
																<X className='size-3' />
															</button>
														</div>
													),
												)}
											</div>
										)}
									</div>

									{/* Basic Information */}
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-1'>
											<label
												htmlFor='title'
												className='block text-sm font-medium text-slate-700'>
												Product
												Name
											</label>
											<Field
												name='title'
												id='title'
												placeholder='Enter product name'
												className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
											/>
											{errors.title &&
												touched.title && (
													<p className='text-red-500 text-xs'>
														{
															errors.title
														}
													</p>
												)}
										</div>

										<div className='space-y-1'>
											<label
												htmlFor='category'
												className='block text-sm font-medium text-slate-700'>
												Category
											</label>
											<div className='relative'>
												<Field
													as='select'
													name='category'
													id='category'
													className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500 appearance-none'>
													<option value=''>
														Select
														a
														category
													</option>
													{Object.entries(
														categories,
													).map(
														([
															key,
															value,
														]) => (
															<option
																key={
																	key
																}
																value={
																	key
																}>
																{
																	value
																}
															</option>
														),
													)}
												</Field>
												<ChevronDown className='absolute right-3 top-2.5 h-4 w-4 text-slate-400' />
											</div>
											{errors.category &&
												touched.category && (
													<p className='text-red-500 text-xs'>
														{
															errors.category
														}
													</p>
												)}
										</div>

										<div className='space-y-1'>
											<label
												htmlFor='defaultPrice'
												className='block text-sm font-medium text-slate-700'>
												Price
											</label>
											<div className='relative'>
												<span className='absolute left-3 top-2.5 text-slate-500'>
													₹
												</span>
												<Field
													name='defaultPrice'
													id='defaultPrice'
													placeholder='0.00'
													className='border border-slate-300 px-3 py-2 pl-8 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
												/>
											</div>
											{errors.defaultPrice &&
												touched.defaultPrice && (
													<p className='text-red-500 text-xs'>
														{
															errors.defaultPrice
														}
													</p>
												)}
										</div>

										<div className='space-y-1'>
											<label
												htmlFor='discount'
												className='block text-sm font-medium text-slate-700'>
												Discount
												(%)
											</label>
											<Field
												name='discount'
												id='discount'
												type='number'
												placeholder='0'
												className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
											/>
										</div>

										<div className='space-y-1'>
											<label
												htmlFor='stockCount'
												className='block text-sm font-medium text-slate-700'>
												Stock
												Count
											</label>
											<Field
												name='stockCount'
												id='stockCount'
												type='number'
												placeholder='0'
												className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
											/>
											{errors.stockCount &&
												touched.stockCount && (
													<p className='text-red-500 text-xs'>
														{
															errors.stockCount
														}
													</p>
												)}
										</div>

										<div className='space-y-1'>
											<label
												htmlFor='stockStatus'
												className='block text-sm font-medium text-slate-700'>
												Stock
												Status
											</label>
											<Field
												as='select'
												name='stockStatus'
												id='stockStatus'
												className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'>
												<option
													value={
														1
													}>
													In
													Stock
												</option>
												<option
													value={
														0
													}>
													Out
													of
													Stock
												</option>
											</Field>
										</div>
									</div>

									{/* Description */}
									<div className='space-y-1'>
										<label
											htmlFor='description'
											className='block text-sm font-medium text-slate-700'>
											Description
										</label>
										<div className='relative'>
											<Field
												as='textarea'
												name='description'
												id='description'
												onChange={(
													e,
												) => {
													if (
														e
															.target
															.value
															.length <
														301
													) {
														setFieldValue(
															"description",
															e
																.target
																.value,
														);
													}
												}}
												max='300'
												placeholder='Write product description here...'
												className='border text-sm border-slate-300 px-3 py-2 rounded-md w-full h-32 focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
											/>
											<span className='absolute bottom-2 right-2 text-xs text-slate-500 bg-white/80 px-2 py-0.5 rounded'>
												{
													values
														.description
														.length
												}
												/300
											</span>
										</div>
										{errors.description &&
											touched.description && (
												<p className='text-red-500 text-xs'>
													{
														errors.description
													}
												</p>
											)}
									</div>
								</div>

								{/* Variants Section */}
								<div className='space-y-4'>
									<h3 className='text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2'>
										Product Variants
									</h3>
									<FieldArray name='prices'>
										{({
											remove,
											push,
										}) => (
											<div className='space-y-4'>
												{values.prices.map(
													(
														price,
														i,
													) => (
														<div
															key={
																i
															}
															className='bg-white p-4 rounded-lg border border-slate-200 shadow-sm'>
															<div className='flex gap-3 items-center'>
																<div className='flex-1 space-y-2'>
																	<label className='block text-sm font-medium text-slate-700'>
																		Variant
																		Type
																	</label>
																	<Field
																		name={`prices.${i}.type`}
																		placeholder='e.g. Size, Color, Material'
																		className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
																	/>
																</div>
																<button
																	type='button'
																	className='mt-6 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors'
																	onClick={() =>
																		remove(
																			i,
																		)
																	}>
																	<Trash className='size-4' />
																</button>
															</div>

															<FieldArray
																name={`prices.${i}.variants`}>
																{({
																	remove: removeSize,
																	push: pushSize,
																}) => (
																	<div className='mt-3 space-y-2'>
																		<label className='block text-sm font-medium text-slate-700'>
																			Options
																		</label>
																		{price.variants.map(
																			(
																				size,
																				j,
																			) => (
																				<div
																					key={
																						j
																					}
																					className='flex gap-2'>
																					<Field
																						name={`prices.${i}.variants.${j}.label`}
																						placeholder='Name'
																						className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
																					/>
																					<Field
																						name={`prices.${i}.variants.${j}.value`}
																						placeholder='Price'
																						className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
																					/>
																					<button
																						type='button'
																						onClick={() =>
																							removeSize(
																								j,
																							)
																						}
																						className='bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-md transition-colors'>
																						<Trash className='size-4' />
																					</button>
																				</div>
																			),
																		)}
																		<button
																			type='button'
																			onClick={() =>
																				pushSize(
																					{
																						label: "",
																						value: "",
																					},
																				)
																			}
																			className='bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm flex items-center justify-center gap-1 py-2 px-3 rounded-md mt-2 transition-colors'>
																			<Plus className='size-4' />
																			Add
																			Option
																		</button>
																	</div>
																)}
															</FieldArray>
														</div>
													),
												)}
												<button
													type='button'
													onClick={() =>
														push(
															{
																type: "",
																variants: [],
															},
														)
													}
													className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm transition-colors'>
													<Plus className='size-4' />
													Add
													Variant
													Type
												</button>
											</div>
										)}
									</FieldArray>
								</div>

								{/* Extras Section */}
								<div className='space-y-4'>
									<h3 className='text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2'>
										Product Extras
									</h3>
									<FieldArray name='extras'>
										{({
											push,
											remove,
										}) => (
											<div className='space-y-3'>
												{values.extras.map(
													(
														extra,
														i,
													) => (
														<div
															key={
																i
															}
															className='flex gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm'>
															<Field
																name={`extras.${i}.name`}
																placeholder='Extra name'
																className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
															/>
															<Field
																name={`extras.${i}.price`}
																placeholder='Price'
																className='border border-slate-300 px-3 py-2 rounded-md w-full focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
															/>
															<button
																type='button'
																className='bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-md transition-colors'
																onClick={() =>
																	remove(
																		i,
																	)
																}>
																<Trash className='size-4' />
															</button>
														</div>
													),
												)}
												<button
													type='button'
													onClick={() =>
														push(
															{
																name: "",
																price: "",
															},
														)
													}
													className='bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm transition-colors'>
													<Plus className='size-4' />
													Add
													Extra
												</button>
											</div>
										)}
									</FieldArray>
								</div>

								{/* Status and Actions */}
								<div className='flex  items-center justify-between pt-4 border-t border-slate-200'>
									<label className='inline-flex items-center cursor-pointer'>
										<Field
											type='checkbox'
											name='status'
											className='sr-only peer'
										/>
										<div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
										<span className='ms-3 text-sm font-medium text-slate-700'>
											{values.status
												? "Active"
												: "Inactive"}{" "}
											Product
										</span>
									</label>

									<div className='flex gap-3'>
										{onClose && (
											<button
												type='button'
												onClick={
													onClose
												}
												className='bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-md transition-colors'>
												Cancel
											</button>
										)}
										<button
											type='submit'
											disabled={
												isPendingProduct
											}
											className='bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
											{isPendingProduct
												? "Processing..."
												: action ===
												  "edit"
												? "Save"
												: "Submit"}
										</button>
									</div>
								</div>
							</Form>
						</>
					);
				}}
			</Formik>
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						message={message}
						type={type}
						onClose={closePopup}
					/>
				)}
			</Modal>
		</>
	);
};

export default ProductForm;
