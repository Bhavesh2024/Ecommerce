"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import dynamic from "next/dynamic";
import MessageLoader from "@/components/loader/MessageLoader";
import Image from "next/image";
const Message = dynamic(() => import("@/components/popup/Message"), {
	ssr: false,
	loading: () => <MessageLoader />,
});
// Yup validation schema
const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { message, showError, showSuccess, isOpen, type } =
		usePopupMessage();
	const router = useRouter();
	const { role } = useParams();
	const { mutate } = useMutation({
		mutationFn: handleAuth,
		onSuccess: (data) => {
			showSuccess(data.message);
		},
		onError: (err) => {
			showError(err);
		},
	});

	useEffect(() => {
		setTimeout(() => {
			if (type == "success") {
				router.push(role == "admin" ? `/user/${role}` : "/");
			}
		}, 3000);
	}, [isOpen]);

	return (
		<>
			<div className='fixed w-full top-0 start-0 z-50'>
				<ProductNav />
			</div>
			<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-full bg-purple-50'>
				{/* Right column (Image) */}
				<div className='hidden lg:flex h-screen w-full items-center'>
					<Image
						src='/images/auth/auth-banner.svg'
						alt='Banner'
						loading='lazy'
						height={100}
						width={100}
						className='h-10/12 w-full object-contain'
					/>
				</div>
				{/* Left column (Form) */}
				<div className='flex mt-16 md:mt-0 items-center justify-center p-8 relative'>
					<div className='w-full md:w-3/4 lg:w-2/3 relative'>
						{isOpen && (
							<Message
								type={type}
								message={message}
								position='absolute -top-12'
							/>
						)}
						<h2 className='text-2xl md:text-3xl font-bold font-sans  text-purple-600  mb-2'>
							Login to Your Account
						</h2>
						<p className=' text-gray-600 mb-6'>
							Welcome back! Please enter your
							credentials to continue.
						</p>

						<Formik
							initialValues={{
								email: "",
								password: "",
							}}
							validationSchema={LoginSchema}
							onSubmit={async (values) => {
								try {
									const data = {
										...values,
										role: role,
									};
									mutate({
										method: "post",
										type: "login",
										data,
									});
								} catch (err) {
									showError(err.message);
								}
							}}>
							{({
								isSubmitting,
								errors,
								touched,
							}) => (
								<Form className='space-y-4'>
									<div>
										<Field
											type='email'
											name='email'
											placeholder='Email'
											className={`input w-full h-10 px-2 pr-10 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
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
										<div className='flex justify-end'>
											<Link
												href={`/user/${role}/auth/verification`}
												className='text-purple-700 mt-2 hover:text-purple-500 text-xs flex ms-auto'>
												Forgot
												Password
												?
											</Link>
										</div>
									</div>
									<button
										type='submit'
										className=' w-full bg-purple-700 text-white py-2 rounded  hover:bg-purple-500 transition'
										disabled={
											isSubmitting
										}>
										{isSubmitting
											? "Submitting..."
											: "Login"}
									</button>
									<p className='text-slate-500 text-center text-sm'>
										Create an account ?{" "}
										<Link
											href={`/user/customer/auth/signup`}
											className='text-purple-700 hover:text-purple-500'>
											Register
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

export default LoginPage;
