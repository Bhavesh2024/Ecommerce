"use client";

import React, { useRef, useEffect, useState } from "react";
import ProductNav from "@/layout/navbar/ProductNav";
import { useMutation } from "@tanstack/react-query";
import { handleAuth } from "@/utils/api/authApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import Message from "@/components/popup/Message";
import { useParams, useRouter } from "next/navigation";

const CodeVerification = () => {
	const [otp, setOtp] = useState(new Array(6).fill(""));
	const [token, setToken] = useState(null);
	const inputsRef = useRef([]);
	const { message, showError, showSuccess, isOpen, type } =
		usePopupMessage();
	const router = useRouter();
	const { role } = useParams();

	const { mutate, isLoading } = useMutation({
		mutationFn: handleAuth,
		onSuccess: (data) => {
			const { message, token } = data;
			setToken(token);
			showSuccess(message);
		},
		onError: (err) => {
			showError(err);
		},
	});

	useEffect(() => {
		if (type === "success") {
			const timer = setTimeout(() => {
				if (token) {
					router.push(
						`/user/${role}/auth/forgot-password/${token}`,
					);
				}
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen, token]);

	const handleChange = (e, index) => {
		const value = e.target.value.replace(/\D/, ""); // Only digits allowed

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Move to next input only if digit entered
		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			e.preventDefault();

			// If current box has value, clear it
			if (otp[index]) {
				const newOtp = [...otp];
				newOtp[index] = "";
				setOtp(newOtp);
			}
			// If current box empty, jump to previous
			else if (index > 0) {
				const newOtp = [...otp];
				newOtp[index - 1] = "";
				setOtp(newOtp);
				inputsRef.current[index - 1]?.focus();
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const code = otp.join("");
		if (code.length !== 6) {
			showError("Enter 6-digit code");
			return;
		}
		const data = { otp: code, role };
		mutate({ method: "post", type: "otpVerification", data });
	};

	return (
		<>
			<div className='fixed w-full top-0 start-0'>
				<ProductNav />
			</div>

			<div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-full bg-purple-50'>
				{/* Right column - Image */}
				<div className='hidden lg:flex h-screen w-full items-center'>
					<img
						src='/images/auth/auth-banner.svg'
						alt='Banner'
						className='h-10/12 w-full object-contain'
					/>
				</div>

				{/* Left column - OTP Form */}
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
							Code Verification
						</h2>
						<p className='text-gray-600 mb-6'>
							Enter the 6-digit code sent to your
							registered email.
						</p>

						<form
							onSubmit={handleSubmit}
							className='space-y-6'>
							<div className='flex justify-between gap-2'>
								{otp.map((digit, index) => (
									<input
										key={index}
										type='text'
										maxLength='1'
										value={digit}
										ref={(el) =>
											(inputsRef.current[
												index
											] = el)
										}
										onChange={(e) =>
											handleChange(
												e,
												index,
											)
										}
										onKeyDown={(e) =>
											handleKeyDown(
												e,
												index,
											)
										}
										className='h-9 w-9 md:w-12 md:h-12 border border-slate-400 rounded-md text-center text-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
									/>
								))}
							</div>

							<button
								type='submit'
								className='w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-500 transition'
								disabled={isLoading}>
								{isLoading
									? "Verifying..."
									: "Verify"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default CodeVerification;
