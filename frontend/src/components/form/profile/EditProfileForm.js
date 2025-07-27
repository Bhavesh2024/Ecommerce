"use client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/utils/api/profileApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useCustomerStoreActions } from "@/hooks/store/useCustomerStore";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/loader/PageLoader";
import { defaultImage } from "@/utils/helper/web-content";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modal/Modal"), {
	loading: () => <PageLoader />,
	ssr: false,
});
const Response = dynamic(() => import("@/components/modal/response/Response"), {
	loading: () => <PageLoader />,
	ssr: false,
});
const EditProfileForm = ({ initialData }) => {
	const [profileImage, setProfileImage] = useState(initialData.image);
	const [profileData, setProfileData] = useState(null);
	const [isUploaded, setIsUploaded] = useState(false);
	const fileRef = useRef(0);
	const router = useRouter();
	const {
		isOpen,
		closePopup,
		message,
		type,
		showSuccess,
		showError,
		loading,
		startLoading,
	} = usePopupMessage();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfileImage(file);
		}
	};
	const { setValue } = useCustomerStoreActions();

	const { mutate: profileMutation, isPending } = useMutation({
		mutationFn: updateProfile,
		onSuccess: (data) => {
			if (profileImage instanceof File) {
				const { image } = data;
				setProfileImage(image);
				setIsUploaded(true);
			} else {
				const { user } = data;
				setValue("user", user);
				showSuccess("Profile Updated Successfully");
				setTimeout(() => {
					router.push(
						initialData.role == "admin"
							? "/user/admin"
							: "/",
					);
				}, 3000);
			}
		},
		onError: (err) => {
			showError(err);
		},
		onSettled: () => {
			setTimeout(() => {
				closePopup();
			}, 3000);
		},
	});

	const validationSchema = Yup.object({
		name: Yup.string().required("Name is required"),
		email: Yup.string()
			.email("Invalid email")
			.required("Email is required"),
		phone: Yup.string()
			.matches(/^\d{10}$/, "Phone must be 10 digits")
			.required("Phone is required"),
		gender: Yup.string()
			.oneOf(["male", "female", "other"])
			.required("Gender is required"),
		birthDate: Yup.date()
			.max(
				dayjs().subtract(18, "years").toDate(),
				"You must be 18 or older",
			)
			.required("Birth date is required"),
		addresses: Yup.array()
			.of(Yup.string().required("Address cannot be empty"))
			.max(3, "You can only add up to 3 addresses"),
	});

	const initialValues = {
		name: initialData?.name || "",
		email: initialData?.email || "",
		phone: initialData?.phone || "",
		gender: initialData?.gender || "male",
		birthDate: initialData?.birthDate?.split("T")[0] || "",
		addresses: Array.isArray(initialData?.address)
			? initialData.address
			: initialData?.address
			? [initialData.address]
			: [""],
	};

	const handleSubmit = (values) => {
		setProfileData(values);
		startLoading();
		if (profileImage instanceof File) {
			const formData = new FormData();
			formData.append("image", profileImage);
			profileMutation({
				method: "post",
				type: "upload",
				data: formData,
			});
		} else {
			const payload = {
				...values,
				id: initialData.id,
				oldEmail: initialData.email,
				oldPhone: initialData.phone,
				image: profileImage,
			};
			profileMutation({
				method: "put",
				type: "profile",
				data: payload,
			});
		}
		// Send `values` and `profileImage` to server here
	};

	useEffect(() => {
		if (isUploaded && profileImage) {
			profileMutation({
				method: "put",
				type: "profile",
				data: {
					...profileData,
					id: initialData.id,
					oldEmail: initialData.email,
					oldPhone: initialData.phone,
					image: profileImage,
				},
			});
		}
	}, [isUploaded, profileImage]);

	return (
		<div className='w-full max-w-3xl mx-auto p-6 text-center md:text-start'>
			<h2 className='text-2xl font-semibold mb-1 text-purple-700'>
				Update Profile
			</h2>
			<p className='text-slate-600 mb-6 text-sm'>
				Keep your profile details updated for a better
				experience.
			</p>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}>
				{({ values, errors, touched }) => (
					<Form className='space-y-3'>
						{/* Profile Image + Basic Info */}
						<div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-6'>
							<div className='flex flex-col items-center'>
								<img
									src={
										!profileImage
											? defaultImage
											: typeof profileImage ===
											  "string"
											? profileImage
											: URL.createObjectURL(
													profileImage,
											  )
									}
									alt='Profile Preview'
									className='w-36 h-36 object-cover rounded-full md:rounded'
								/>
								<button
									type='button'
									className='mt-3 w-36 h-10 bg-purple-600 text-white px-4 py-1 rounded-full md:rounded hover:bg-purple-300'
									onClick={() =>
										fileRef.current.click()
									}>
									Upload
								</button>
							</div>

							<div className='flex flex-col gap-3 w-full'>
								<div>
									<Field
										name='name'
										className={`input w-full h-10 px-2 pr-10 border rounded-md focus:outline-none  focus:ring-1  ${
											errors.name &&
											touched.name
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
										}`}
										placeholder='Your Name'
									/>
									<ErrorMessage
										name='name'
										component='div'
										className='text-red-500 text-sm'
									/>
								</div>

								<div>
									<Field
										as='select'
										name='gender'
										className={`input w-full h-10 px-2 pr-10 border rounded-md focus:outline-none  focus:ring-1  ${
											errors.gender &&
											touched.gender
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
										}`}>
										<option value='male'>
											Male
										</option>
										<option value='female'>
											Female
										</option>
										<option value='other'>
											Other
										</option>
									</Field>
									<ErrorMessage
										name='gender'
										component='div'
										className='text-red-500 text-sm'
									/>
								</div>

								<div>
									<Field
										name='birthDate'
										type='date'
										className={`input w-full h-10 px-2 border rounded-md focus:outline-none  focus:ring-1  ${
											errors.birthDate &&
											touched.birthDate
												? "border-red-500 focus:border-red-500 focus:ring-red-500"
												: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
										}`}
									/>
									<ErrorMessage
										name='birthDate'
										component='div'
										className='text-red-500 text-sm'
									/>
								</div>
							</div>
						</div>

						{/* Contact Info */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
							<div>
								<Field
									name='email'
									type='email'
									placeholder='Email'
									className={`input w-full h-10 px-2 border rounded-md focus:outline-none  focus:ring-1  ${
										errors.email &&
										touched.email
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
									}`}
								/>
								<ErrorMessage
									name='email'
									component='div'
									className='text-red-500 text-sm'
								/>
							</div>

							<div>
								<Field
									name='phone'
									placeholder='Phone Number'
									className={`input w-full h-10 px-2 border rounded-md focus:outline-none  focus:ring-1  ${
										errors.phone &&
										touched.phone
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
									}`}
								/>
								<ErrorMessage
									name='phone'
									component='div'
									className='text-red-500 text-sm'
								/>
							</div>
						</div>

						{/* Address Section */}
						<div>
							<FieldArray name='addresses'>
								{({ push, remove }) => (
									<div className='space-y-2'>
										{values.addresses.map(
											(
												_,
												index,
											) => (
												<>
													<div
														key={
															index
														}
														className='flex items-center gap-2'>
														<Field
															as='textarea'
															name={`addresses[${index}]`}
															className={`w-full h-20 px-2 border rounded-md focus:outline-none  focus:ring-1  ${
																errors
																	?.addresses?.[
																	index
																] &&
																touched
																	?.addresses?.[
																	index
																]
																	? "border-red-500 focus:border-red-500 focus:ring-red-500"
																	: "border-slate-400 focus:border-purple-500 focus:ring-purple-500"
															}`}
															placeholder={`Address ${
																index +
																1
															}`}
														/>

														{index >
															0 && (
															<button
																type='button'
																onClick={() =>
																	remove(
																		index,
																	)
																}
																className='text-red-600 text-sm'>
																<Trash2 />
															</button>
														)}
													</div>
													<ErrorMessage
														name={`addresses[${index}]`}
														component='div'
														className='text-red-500 text-sm -mt-2'
													/>
												</>
											),
										)}
										{values.addresses
											.length <
											3 && (
											<button
												type='button'
												onClick={() =>
													push(
														"",
													)
												}
												className='flex items-center gap-1 px-3 py-2 bg-slate-800 text-white rounded text-sm'>
												<Plus className='size-4' />{" "}
												Add
												Address
											</button>
										)}
									</div>
								)}
							</FieldArray>
						</div>

						{/* Hidden File Upload */}
						<input
							type='file'
							ref={fileRef}
							onChange={handleImageChange}
							accept='image/*'
							hidden
						/>

						{/* Submit Button */}
						<div className='flex justify-center'>
							<button
								type='submit'
								className='bg-purple-600 w-full md:w-fit mt-2 text-white px-6 py-2 rounded-full hover:bg-purple-700'>
								Submit
							</button>
						</div>
					</Form>
				)}
			</Formik>

			{/* Modal */}
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{type && (
					<Response
						type={type}
						message={message}
						onClose={closePopup}
					/>
				)}
			</Modal>
		</div>
	);
};

export default EditProfileForm;
