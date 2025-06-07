"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import Message from "@/components/popup/Message";
import { useParams, useRouter } from "next/navigation";

// Yup validation schema
const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const LoginPage = () => {
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
			<div className='fixed w-full top-0 start-0'>
				<ProductNav />
			</div>
			<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-screen'>
				{/* Left column (Form) */}
				<div className='flex mt-16 md:mt-0 items-center justify-center p-8 relative'>
					<div className='w-full md:w-3/4 lg:w-2/3 relative'>
						{isOpen && (
							<Message
								type={type}
								message={message}
							/>
						)}
						<h2 className='text-2xl md:text-4xl font-bold text-neutral-700  mb-2'>
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
								console.log(
									"Submitted Data:",
									values,
								);
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
							{({ isSubmitting }) => (
								<Form className='space-y-4'>
									<div>
										<Field
											type='email'
											name='email'
											placeholder='Email'
											className='input w-full h-10 px-2 border border-slate-400 rounded-md'
										/>
										<ErrorMessage
											name='email'
											component='div'
											className='text-sm text-red-500'
										/>
									</div>

									<div>
										<Field
											type='password'
											name='password'
											placeholder='Password'
											className='input w-full h-10 px-2 border border-slate-400 rounded-md'
										/>
										<ErrorMessage
											name='password'
											component='div'
											className='text-sm text-red-500'
										/>
									</div>

									<button
										type='submit'
										className=' w-full bg-indigo-500 text-white py-2 rounded  hover:bg-indigo-600 transition'
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
											className='text-indigo-500 hover:text-indigo-600'>
											Register
										</Link>
									</p>
								</Form>
							)}
						</Formik>
					</div>
				</div>

				{/* Right column (Image) */}
				<div className='hidden lg:flex h-full w-full'>
					<img
						src='/images/auth/auth-banner.svg'
						alt='Banner'
						className='h-full w-full object-contain'
					/>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
