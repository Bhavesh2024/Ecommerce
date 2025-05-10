"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Link from "next/link";

// Yup validation schema
const SignupSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const LoginPage = () => {
	return (
		<>
			<div className="fixed w-full top-0 start-0">
				<ProductNav />
			</div>
			<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-screen bg-gray-50">
				{/* Left column (Form) */}
				<div className="flex items-center justify-center p-8">
					<div className="w-full md:w-3/4 lg:w-2/3">
						<h2 className="text-2xl md:text-4xl font-bold text-neutral-700  mb-2">
							Login to Your Account
						</h2>
						<p className=" text-gray-600 mb-6">
							Welcome back! Please enter your credentials to
							continue.
						</p>

						<Formik
							initialValues={{
								email: "",
								password: "",
							}}
							validationSchema={SignupSchema}
							onSubmit={(values) => {
								console.log("Submitted Data:", values);
							}}
						>
							{({ isSubmitting }) => (
								<Form className="space-y-4">
									<div>
										<Field
											type="email"
											name="email"
											placeholder="Email"
											className="input w-full h-10 px-2 border border-slate-400 rounded-md"
										/>
										<ErrorMessage
											name="email"
											component="div"
											className="text-sm text-red-500"
										/>
									</div>

									<div>
										<Field
											type="password"
											name="password"
											placeholder="Password"
											className="input w-full h-10 px-2 border border-slate-400 rounded-md"
										/>
										<ErrorMessage
											name="password"
											component="div"
											className="text-sm text-red-500"
										/>
									</div>

									<button
										type="submit"
										className=" w-full bg-indigo-500 text-white py-2 rounded  hover:bg-indigo-600 transition"
										disabled={isSubmitting}
									>
										{isSubmitting
											? "Submitting..."
											: "Login"}
									</button>
									<p className="text-slate-500 text-center text-sm">
										Create an account ?{" "}
										<Link
											href={`/user/customer/auth/signup`}
											className="text-indigo-500 hover:text-indigo-600"
										>
											Register
										</Link>
									</p>
								</Form>
							)}
						</Formik>
					</div>
				</div>

				{/* Right column (Image) */}
				<div className="hidden lg:flex h-full w-full">
					<img
						src="/images/auth/auth-banner.svg"
						alt="Banner"
						className="h-full w-full object-contain"
					/>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
