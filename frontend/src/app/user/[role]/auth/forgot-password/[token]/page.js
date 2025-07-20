"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import Message from "@/components/popup/Message";
import { useRouter, useParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/components/not-found/NotFound";

const ResetPasswordSchema = Yup.object().shape({
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Passwords must match")
		.required("Confirm Password is required"),
});

const ResetPasswordPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { token } = useParams();
	const {
		data,
		isSuccess: isVerified,
		isError,
	} = useAuth("forgotPassword", token, true);
	const { message, showError, showSuccess, isOpen, type } =
		usePopupMessage();
	const router = useRouter();

	const { mutate } = useMutation({
		mutationFn: handleAuth,
		onSuccess: (data) => {
			showSuccess(data.message);
		},
		onError: (err) => {
			showError(err);
		},
	});

	// useEffect(() => {
	// 	if (!token) return;
	// 	verifyToken(token, "resetPassword"); // Optional: Verify token before allowing reset
	// }, [token]);

	useEffect(() => {
		if (type === "success") {
			const timer = setTimeout(() => {
				router.push("/user/customer/auth/login");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	return (
		<>
			{isError && (
				<NotFound
					title='401'
					heading='Unauthorized Access'
					message='Sorry, You are Not Authorized to Access this Page'
					showHomeLink
				/>
			)}
			{isVerified && (
				<>
					<div className='fixed w-full top-0 start-0'>
						<ProductNav />
					</div>

					<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-full bg-purple-50'>
						{/* Right column */}
						<div className='hidden lg:flex h-screen w-full items-center'>
							<img
								src='/images/auth/auth-banner.svg'
								alt='Banner'
								className='h-10/12 w-full object-contain'
							/>
						</div>

						{/* Left column */}
						<div className='flex mt-16 md:mt-0 items-center justify-center p-8 relative'>
							<div className='w-full md:w-3/4 lg:w-2/3 relative'>
								{isOpen && (
									<Message
										type={type}
										message={message}
										position='absolute -top-12'
									/>
								)}

								<h2 className='text-2xl md:text-3xl font-bold text-purple-600 mb-2'>
									Reset Your Password
								</h2>
								<p className='text-gray-600 mb-6'>
									Enter your new password
									below.
								</p>

								<Formik
									initialValues={{
										password: "",
										confirmPassword: "",
									}}
									validationSchema={
										ResetPasswordSchema
									}
									onSubmit={(values) => {
										const payload = {
											email: data.email,
											password: values.password,
										};
										console.log(data);
										mutate({
											method: "put",
											type: "resetPassword",
											data: payload,
										});
									}}>
									{({
										isSubmitting,
										errors,
										touched,
									}) => (
										<Form className='space-y-4'>
											<Field
												type={
													"text"
												}
												placeholder='Email'
												value={
													data.email
												}
												className={`w-full h-10 px-2 pr-10 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 `}
												disabled={
													true
												}
											/>
											{/* New Password */}
											<div className='relative'>
												<Field
													type={
														showPassword
															? "text"
															: "password"
													}
													name='password'
													placeholder='New Password'
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
												<ErrorMessage
													name='password'
													component='div'
													className='text-sm text-red-500'
												/>
											</div>

											{/* Confirm Password */}
											<div className='relative'>
												<Field
													type={
														showConfirmPassword
															? "text"
															: "password"
													}
													name='confirmPassword'
													placeholder='Confirm Password'
													className={`input w-full h-10 px-2 pr-10 border rounded-md focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${
														errors.confirmPassword &&
														touched.confirmPassword
															? "border-red-500"
															: "border-slate-400"
													}`}
												/>
												<div
													className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-purple-600'
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}>
													{showConfirmPassword ? (
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
												<ErrorMessage
													name='confirmPassword'
													component='div'
													className='text-sm text-red-500'
												/>
											</div>

											<button
												type='submit'
												className='w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-500 transition'
												disabled={
													isSubmitting
												}>
												{isSubmitting
													? "Updating..."
													: "Reset Password"}
											</button>
										</Form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default ResetPasswordPage;
