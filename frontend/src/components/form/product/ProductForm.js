"use client";

import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { CloudUpload, Plus, Trash, Upload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { handleProduct } from "@/utils/api/productApi";
import useAdminStore, {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import Message from "@/components/popup/Message";
import { usePopupMessage } from "@/hooks/usePopupMessage";

const ProductForm = ({ action = "add", data = null, onClose }) => {
	const imageRef = useRef();
	const [responseImages, setResponseImages] = useState([]);
	const [formValues, setFormValues] = useState(false);
	const { message, showError, showSuccess, isOpen, closePopup, type } =
		usePopupMessage();
	const initialValues = {
		title: data ? data.title : "",
		category: data ? data.category : "",
		description: data ? data.description : "",
		defaultPrice: data ? data.defaultPrice : "",
		prices: data ? data.prices : [],
		extras: data ? data.extras : [],
		images: data ? data.images : [],
		discount: data ? data.discount : "",
		stockCount: data ? data.stockCount : "",
		stockStatus: data ? data.stockStatus : 0,
		slug: data ? data.slug : "",
		status: data ? data.status : false,
	};

	// Admin Store State
	const { products } = useAdminStoreState();
	const { addItem, updateItem } = useAdminStoreActions();

	const {
		mutate: productMutation,
		isPending: isPendingProduct,
		isLoading: isLoadingProduct,
		isError: isErrorProduct,
		isSuccess: isSuccessProduct,
	} = useMutation({
		mutationFn: handleProduct,
		onSuccess: function (response) {
			if (Array.isArray(response) && response.length > 0) {
				setResponseImages(response);
			} else {
				showSuccess(response.message);
				setTimeout(() => {
					onClose();
				}, 3000);
				action == "add"
					? addItem("products", response.product)
					: updateItem("products", response.product);
			}
		},
		onError: function (err) {
			console.log(err);
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
			// setFormValues((prev) => ({ ...prev, images: formImages }));
		}
	}, [responseImages, isSuccessProduct, formValues]);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				closePopup();
			}, 3000);
		}
	}, [isOpen]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			validateOnBlur={true}
			validateOnMount={false}
			validateOnChange={true}
			onSubmit={(values) => {
				values.slug = generateSlug(values.title);
				const skus = generateSKUs(values.slug, values.prices);

				let skuIndex = 0;
				const newProductPrices = values.prices.map(
					({ type, variants }) => {
						const updatedVariants = variants.map(
							() => skus[skuIndex++],
						);
						return { type, variants: updatedVariants };
					},
				);

				const productImages = values.images
					.filter(
						(image) =>
							image["file"] || image["file"] == {},
					)
					.map((image) => ({
						file: image.file,
						order: image.order,
					}));
				console.log(productImages);
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
						method: action == "add" ? "post" : "put",
						type: action == "add" ? "add" : "update",
						data: {
							...values,
							prices: newProductPrices,
							oldSlug: data ? data.slug : null,
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
						{isOpen && (
							<Message
								type={type}
								message={message}
								classes='flex items-center justify-center gap-2 top-0 fixed  md:start-[30%] z-40 min-w-fit w-11/12 md:w-2/5 bg-neutral-900 top-5 rounded-sm py-3'
							/>
						)}
						<Form className='p-4 space-y-4 w-full  mx-auto'>
							<h2 className='text-2xl font-semibold text-center text-slate-500'>
								{action === "edit"
									? "Edit"
									: "Add"}{" "}
								Product
							</h2>
							<div>
								<div
									className='flex flex-col gap-1 h-32 w-full border border-slate-300 rounded-md justify-center items-center my-4'
									onClick={() => {
										if (
											values.images
												.length <
											5
										) {
											imageRef.current.click();
										} else {
											alert(
												"Maximum 5 Images are allowed to upload",
											);
										}
									}}>
									<Upload className='size-24 text-slate-300' />
									<span className='text-xs text-slate-500'>
										Upload Product
										Images
									</span>
								</div>
								<input
									type='file'
									accept='image/*'
									hidden
									ref={imageRef}
									multiple
									max={5}
									onChange={(event) => {
										const files =
											Array.from(
												event
													.target
													.files,
											);
										const readers =
											files.map(
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
																				values
																					.images
																					.length +
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
									className='mb-2'
								/>

								{values.images?.length > 0 && (
									<div className='grid grid-cols-2 md:grid-cols-3 gap-2 '>
										{values.images?.map(
											(img, i) => (
												<div
													key={
														i
													}
													className='border border-slate-300 rounded-md w-full relative'>
													<div className='relative'>
														<img
															src={
																img.url
															}
															alt={`img-${i}`}
															className='h-40 w-full object-fill rounded-t-md'
														/>

														{/* Thumbnail Toggle */}
														<div className='mt-1 flex items-center gap-2 absolute bottom-1 start-1'>
															<input
																type='radio'
																name='thumbnail'
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
															/>
														</div>
													</div>
													<div className='flex gap-1 p-2'>
														{/* Label Input */}
														<input
															type='text'
															placeholder='Label'
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
															className='mt-1 text-sm w-full px-2 py-1 border border-slate-300 rounded'
														/>

														{/* Order Input */}
														<div className='flex items-center mt-auto justify-center h-7.5 py-1 w-10 rounded-md border border-slate-300 text-slate-700'>
															{
																img.order
															}
														</div>
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
															className='mt-1 max-w-8 text-sm w-full flex items-center justify-center text-center py-1 border border-slate-300 rounded'
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
														className='absolute top-0 right-0 bg-neutral-800/60 text-white py-2 rounded-e-md rounded-b-none  px-2 text-xs'>
														<X className='size-4' />
													</button>
												</div>
											),
										)}
									</div>
								)}
							</div>
							<div className='flex flex-col gap-1'>
								<Field
									name='title'
									placeholder='Product Name'
									className='border border-slate-300 px-2 h-10 rounded-md w-full'
								/>
								{errors.title &&
									touched.title && (
										<p className='text-red-500 text-xs ms-1'>
											{errors.title}
										</p>
									)}
							</div>

							<div className='flex flex-col gap-1'>
								<Field
									name='defaultPrice'
									placeholder='Price'
									className='border border-slate-300 px-2 h-10 rounded-md w-full'
								/>
								{errors.defaultPrice &&
									touched.defaultPrice && (
										<p className='text-red-500 text-xs ms-1'>
											{
												errors.defaultPrice
											}
										</p>
									)}
							</div>

							<Field
								name='category'
								placeholder='Category'
								className='border border-slate-300 px-2 h-10 rounded-md w-full'
							/>
							<div className='relative'>
								<Field
									as='textarea'
									name='description'
									onChange={(e) => {
										if (
											e.target.value
												.length <
											301
										) {
											setFieldValue(
												"description",
												e.target
													.value,
											);
										}
									}}
									max='300'
									placeholder='Write down description here..'
									className='border text-sm border-slate-300 px-2 h-32 rounded-md w-full'
								/>
								<span
									className={
										"text-slate-400 text-sm absolute bottom-3 end-3"
									}>
									{
										values.description
											.length
									}
									/300
								</span>
							</div>

							<FieldArray name='prices'>
								{({ remove, push }) => (
									<div>
										<div className='flex items-center justify-between'>
											<h3 className='font-semibold text-gray-500'>
												Prices
											</h3>
										</div>
										{values.prices.map(
											(
												price,
												i,
											) => (
												<div
													key={
														i
													}
													className='py-2 mb-2'>
													<div className='flex gap-2'>
														<Field
															name={`prices.${i}.type`}
															placeholder='Type (e.g., single)'
															className='border border-slate-300 px-2 h-10 rounded-md w-full'
														/>
														<button
															type='button'
															className='bg-red-500 text-white px-3 py-2 rounded-md'
															onClick={() =>
																remove(
																	i,
																)
															}>
															<X className='size-4 font-bold' />
														</button>
													</div>
													<FieldArray
														name={`prices.${i}.variants`}>
														{({
															remove: removeSize,
															push: pushSize,
														}) => (
															<div className=''>
																{price.variants.map(
																	(
																		size,
																		j,
																	) => (
																		<div
																			key={
																				j
																			}
																			className='flex gap-2 my-1'>
																			<Field
																				name={`prices.${i}.variants.${j}.label`}
																				placeholder='Name'
																				className='border border-slate-300 px-2 h-10 rounded-md w-full'
																			/>
																			<Field
																				name={`prices.${i}.variants.${j}.value`}
																				placeholder='Price'
																				className='border border-slate-300 px-2 h-10 rounded-md w-full'
																			/>
																			<button
																				type='button'
																				onClick={() =>
																					removeSize(
																						j,
																					)
																				}
																				className='bg-red-400 px-3 py-2 flex items-center justify-center rounded-md shadow'>
																				{/* <X className='text-white size-4' /> */}
																				<Trash className='text-white size-4' />
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
																	className='bg-violet-500 text-white text-sm flex items-center justify-center gap-1 py-2 px-3 rounded-md mt-1'>
																	<Plus className='size-4' />
																	Add
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
												push({
													type: "",
													variants: [],
												})
											}
											className='bg-neutral-900 text-white px-3 py-2 rounded-md flex items-center justify-center gap-1 text-sm'>
											<Plus className='size-4' />
											Add Type
										</button>
									</div>
								)}
							</FieldArray>

							<FieldArray name='extras'>
								{({ push, remove }) => (
									<div>
										<h3 className='font-semibold'>
											Extras
										</h3>
										{values.extras.map(
											(
												extra,
												i,
											) => (
												<div
													key={
														i
													}
													className='flex gap-2 my-1'>
													<Field
														name={`extras.${i}.name`}
														placeholder='Name'
														className='border border-slate-300 px-2 h-10 rounded-md w-full'
													/>
													<Field
														name={`extras.${i}.price`}
														placeholder='Price'
														className='border border-slate-300 px-2 h-10 rounded-md w-full'
													/>
													<button
														type='button'
														className='bg-red-400 text-white px-3 py-2 rounded-md'
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
												push({
													name: "",
													price: "",
												})
											}
											className='bg-violet-500 text-white text-sm flex items-center justify-center gap-1 py-2 px-3 rounded-md mt-1'>
											<Plus className='size-4' />
											Add
										</button>
									</div>
								)}
							</FieldArray>

							<Field
								name='discount'
								type='number'
								placeholder='Discount %'
								className='border border-slate-300 px-2 h-10 rounded-md w-full'
							/>
							<Field
								name='stockCount'
								type='number'
								placeholder='Stock Count'
								className='border border-slate-300 px-2 h-10 rounded-md w-full'
							/>

							<Field
								as='select'
								name='stockStatus'
								className='border border-slate-300 px-2 h-10 rounded-md w-full'>
								<option value={1}>
									In Stock
								</option>
								<option value={0}>
									Out of Stock
								</option>
							</Field>
							<div className='flex items-center gap-2'>
								<Field
									type='checkbox'
									name='status'
									id='status'
									className='form-checkbox'></Field>
								<label className='text-xs text-slate-600'>
									Set Product as Active
								</label>
							</div>
							<div className='flex gap-4'>
								<button
									type='submit'
									name='submit'
									className='bg-blue-600 text-white px-4 py-2 rounded'>
									{action === "edit"
										? "Save"
										: "Submit"}
								</button>
								{onClose && (
									<button
										type='button'
										onClick={onClose}
										className='bg-neutral-900 text-white px-4 py-2 rounded'>
										Cancel
									</button>
								)}
							</div>
						</Form>
					</>
				);
			}}
		</Formik>
	);
};

export default ProductForm;
