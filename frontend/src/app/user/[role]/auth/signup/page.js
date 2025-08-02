"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import MessageLoader from "@/components/loader/MessageLoader";
import Image from "next/image";
import dayjs from "dayjs";
const Message = dynamic(() => import("@/components/popup/Message"), {
	ssr: false,
	loading: () => <MessageLoader />,
});

// Yup validation schema
const SignupSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	birthDate: Yup.date()
		.max(
			dayjs().subtract(18, "years").toDate(),
			"You must be 18 or older",
		)
		.required("Birth date is required"),
	gender: Yup.string().required("Gender is required"),
	contact: Yup.string()
		.matches(/^[0-9]{10}$/, "Must be a valid 10-digit phone number")
		.required("Contact is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	terms: Yup.boolean()
		.oneOf([true], "You must accept the terms and conditions")
		.required(),
});

const SignupPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const {
		message,
		type,
		showSuccess,
		showError,
		isOpen,
		closePopup,
		loading,
		startLoading,
	} = usePopupMessage();
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: handleAuth,
		onSuccess: (data) => {
			showSuccess(data.message);
		},
		onError: (err) => {
			showError(err);
		},
	});

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				if (type == "success") {
					router.push("/user/customer/auth/login");
				} else {
					closePopup();
				}
			}, 3000);
		}
	}, [isOpen]);
	return (
		<>
			<div className='fixed w-full top-0 start-0'>
				<ProductNav />
			</div>

			<div className='min-h-screen mt-16 md:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-3 w-screen '>
				{/* Banner Image */}
				<div className='hidden lg:flex items-center h-screen w-full'>
					{/* <img
						src='/images/auth/auth-banner.svg'
						alt='Banner'
						className='h-10/12 w-full object-contain'
					/> */}
					<Image
						src='/images/auth/auth-banner.svg'
						alt='Banner'
						loading='lazy'
						height={100}
						width={100}
						className='h-10/12 w-full object-contain'
					/>
				</div>
				{/* Sign Up Form */}
				<div className='flex items-center justify-center p-8'>
					<div className='w-full md:w-3/4 lg:w-2/3 relative'>
						{!isPending && message && (
							<Message
								type={type}
								message={message}
								position='absolute -top-12'
							/>
						)}
						<h2 className='text-2xl md:text-3xl font-bold font-sans text-purple-600 mb-2'>
							Create Account
						</h2>
						<p className=' text-gray-600 mb-6'>
							Join our platform to explore endless
							opportunities.
						</p>

						<Formik
							initialValues={{
								name: "",
								birthDate: "",
								gender: "",
								contact: "",
								email: "",
								password: "",
								terms: false,
							}}
							validationSchema={SignupSchema}
							onSubmit={async (values) => {
								startLoading();
								try {
									mutate({
										method: "post",
										type: "register",
										data: values,
									});
								} catch (err) {}
							}}>
							{({
								isSubmitting,
								errors,
								touched,
							}) => (
								<Form className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
										<div>
											<Field
												type='text'
												name='name'
												placeholder='Full Name'
												className={`input w-full h-10 px-2 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
													errors.name &&
													touched.name
														? "border-red-500"
														: "border-slate-400"
												}`}
											/>
											<ErrorMessage
												name='name'
												component='div'
												className='text-sm text-red-500'
											/>
										</div>

										<div>
											<Field
												type='date'
												name='birthDate'
												className={`input w-full h-10 px-2 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
													errors.birthDate &&
													touched.birthDate
														? "border-red-500"
														: "border-slate-400"
												}`}
											/>
											<ErrorMessage
												name='birthDate'
												component='div'
												className='text-sm text-red-500'
											/>
										</div>
									</div>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
										<div>
											<Field
												as='select'
												name='gender'
												className={`input w-full h-10 px-2 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
													errors.gender &&
													touched.gender
														? "border-red-500"
														: "border-slate-400"
												}`}>
												<option value=''>
													Select
													Gender
												</option>
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
												className='text-sm text-red-500'
											/>
										</div>

										<div>
											<Field
												type='tel'
												name='contact'
												placeholder='Contact Number'
												className={`input w-full h-10 px-2 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
													errors.contact &&
													touched.contact
														? "border-red-500"
														: "border-slate-400"
												}`}
											/>
											<ErrorMessage
												name='contact'
												component='div'
												className='text-sm text-red-500'
											/>
										</div>
									</div>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
										<div>
											<Field
												type='email'
												name='email'
												placeholder='Email'
												className={`input w-full h-10 px-2 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
													errors.email &&
													touched.email
														? "border-red-500"
														: "border-slate-400"
												}`}
											/>
											<ErrorMessage
												name='email'
												component='div'
												className='text-sm text-red-500'
											/>
										</div>

										<div>
											<div className='relative'>
												<Field
													type={
														showPassword
															? "text"
															: "password"
													}
													name='password'
													placeholder='Password'
													className={`input w-full h-10 px-2 pr-10 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
														errors.password &&
														touched.password
															? "border-red-500"
															: "border-slate-400"
													}`}
												/>
												<div
													className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-purple-600'
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
													}>
													{showPassword ? (
														<EyeOff
															size={
																18
															}
														/>
													) : (
														<Eye
															size={
																18
															}
														/>
													)}
												</div>
											</div>
											<ErrorMessage
												name='password'
												component='div'
												className='text-sm text-red-500'
											/>
										</div>
									</div>

									<div className='flex items-center space-x-2'>
										<Field
											type='checkbox'
											name='terms'
											className='h-4 w-4'
										/>
										<label
											htmlFor='terms'
											className='text-sm text-gray-600'>
											I agree to the{" "}
											<Link
												href='/term-condition'
												className='text-purple-700 hover:text-purple-500 underline'>
												Terms &
												Conditions
											</Link>
										</label>
									</div>
									<ErrorMessage
										name='terms'
										component='div'
										className='text-sm text-red-500'
									/>

									<button
										type='submit'
										className=' w-full bg-purple-700 text-white py-2 rounded  hover:bg-purple-500 transition'
										disabled={
											isSubmitting
										}>
										{loading
											? "Submitting..."
											: "Sign Up"}
									</button>
									<p className='text-slate-500 text-center text-sm'>
										Do you have an
										account ?{" "}
										<Link
											href={`/user/customer/auth/login`}
											className='text-purple-700 hover:text-purple-500'>
											Login
										</Link>
									</p>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignupPage;
