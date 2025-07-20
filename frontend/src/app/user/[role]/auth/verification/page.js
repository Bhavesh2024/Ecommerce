"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import MessageLoader from "@/components/loader/MessageLoader";
const Message = dynamic(() => import("@/components/popup/Message"), {
	ssr: false,
	loading: () => <MessageLoader />,
});
// Yup validation schema for email only
const VerificationSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
});

const UserVerification = () => {
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
		if (type === "success") {
			const timer = setTimeout(() => {
				router.push(`/user/${role}/auth/otp-verification`);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	return (
		<>
			<div className='fixed w-full top-0 start-0'>
				<ProductNav />
			</div>

			<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-full bg-purple-50'>
				{/* Right column - Image */}
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

				{/* Left column - Email Form */}
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
							Verify Your Account
						</h2>
						<p className='text-gray-600 mb-6'>
							Enter your registered email to receive
							verification instructions.
						</p>

						<Formik
							initialValues={{ email: "" }}
							validationSchema={VerificationSchema}
							onSubmit={(values) => {
								const payload = {
									...values,
									role: role,
								};
								mutate({
									method: "post",
									type: "verification",
									data: payload,
								});
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
											placeholder='Enter your email'
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

									<button
										type='submit'
										className='w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-500 transition'
										disabled={
											isSubmitting
										}>
										{isSubmitting
											? "Sending..."
											: "Submit"}
									</button>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserVerification;
