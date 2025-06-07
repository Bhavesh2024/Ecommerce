"use client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Plus, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/utils/api/profileApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import Modal from "@/components/modal/Modal";
import Response from "@/components/modal/response/Response";
import { useCustomerStoreActions } from "@/hooks/store/useCustomerStore";
import { useRouter } from "next/navigation";

const EditProfileForm = ({ initialData }) => {
	const [profileImage, setProfileImage] = useState(initialData.image);
	const [profileData, setProfileData] = useState(null);
	const [isUploaded, setIsUploaded] = useState(false);
	const fileRef = useRef(0);
	const router = useRouter();
	const { isOpen, closePopup, message, type, showSuccess, showError } =
		usePopupMessage();
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfileImage(file);
		}
	};
	const { setValue } = useCustomerStoreActions();

	const { mutate: profileMutation, data: responseProfileData } =
		useMutation({
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
		console.log(profileImage);
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
		console.log("Updated Profile:", values);
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

	useEffect(() => {
		console.log("initial data", initialData);
	}, []);
	return (
		<div className='w-full md:w-3/4 lg:w-1/2 mx-auto p-6 md:border border-slate-400  rounded-xl shadow'>
			<h2 className='text-2xl font-semibold mb-4 text-center text-slate-600'>
				Edit Profile
			</h2>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}>
				{({ values }) => (
					<Form className='space-y-4'>
						<div className='flex items-center justify-center'>
							<div className='mt-2 flex flex-col gap-1 w-40 h-40 rounded-md items-center'>
								<div className='flex flex-col items-center justify-center gap-2'>
									<img
										src={
											!profileImage
												? "/images/default/profile.svg"
												: typeof profileImage ==
												  "string"
												? profileImage
												: URL.createObjectURL(
														profileImage,
												  )
										}
										alt='Profile Preview'
										className='w-28 h-28 object-cover rounded-full'
									/>
									<button
										type='button'
										className='bg-indigo-500 text-white h-9 text-sm min-w-28 rounded-full'
										onClick={() =>
											fileRef.current.click()
										}>
										Upload
									</button>
								</div>
							</div>
						</div>

						<div>
							<Field
								name='name'
								className='w-full border border-slate-300 p-2 rounded'
								placeholder='Your Name'
							/>
							<ErrorMessage
								name='name'
								component='div'
								className='text-red-500 text-sm'
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
							<div>
								<Field
									as='select'
									name='gender'
									placeholder='Select Gender'
									className='w-full border border-slate-300 p-2 rounded'>
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
									className='w-full border border-slate-300 p-2 rounded'
								/>
								<ErrorMessage
									name='birthDate'
									component='div'
									className='text-red-500 text-sm'
								/>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
							<div>
								<Field
									name='email'
									type='email'
									placeholder='Email'
									className='w-full border border-slate-300 p-2 rounded'
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
									className='w-full border border-slate-300 p-2 rounded'
								/>
								<ErrorMessage
									name='phone'
									component='div'
									className='text-red-500 text-sm'
								/>
							</div>
						</div>

						<div>
							<FieldArray name='addresses'>
								{({ push, remove }) => (
									<div className='space-y-2'>
										{values.addresses.map(
											(
												_,
												index,
											) => (
												<div
													key={
														index
													}
													className='flex gap-2 items-center'>
													<Field
														as='textarea'
														name={`addresses[${index}]`}
														className='w-full border border-slate-300 p-2 rounded'
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
															className='text-red-600'>
															Remove
														</button>
													)}
												</div>
											),
										)}
										<ErrorMessage
											name='addresses'
											component='div'
											className='text-red-500 text-sm'
										/>
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
												className='flex items-center  p-2 rounded-full text-white bg-neutral-950  text-sm min-w-20 justify-center'>
												<Plus className='size-5' />{" "}
												Add
												Address
											</button>
										)}
									</div>
								)}
							</FieldArray>
						</div>

						<div>
							<input
								type='file'
								ref={fileRef}
								onChange={handleImageChange}
								accept='image/*'
								hidden
							/>
						</div>

						<button
							type='submit'
							className='flex justify-center items-center bg-indigo-600 text-white px-4 py-2 rounded-full w-24 hover:bg-indigo-700 mx-auto'>
							Submit
						</button>
					</Form>
				)}
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

export default EditProfileForm;
