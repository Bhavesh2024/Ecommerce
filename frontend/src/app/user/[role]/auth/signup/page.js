"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Link from "next/link";

// Yup validation schema
const SignupSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	birthDate: Yup.date().required("Birth date is required"),
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
	return (
		<>
			<div className="fixed w-full top-0 start-0">
				<ProductNav />
			</div>
			<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-3 w-screen bg-gray-50">
				{/* Left column (Form) */}
				<div className="flex items-center justify-center p-8">
					<div className="w-full md:w-3/4 lg:w-2/3">
						<h2 className="text-2xl md:text-4xl font-bold text-neutral-700 mb-2">
							Create Account
						</h2>
						<p className=" text-gray-600 mb-6">
							Join our platform to explore endless opportunities.
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
							onSubmit={(values) => {
								console.log("Submitted Data:", values);
							}}
						>
							{({ isSubmitting }) => (
								<Form className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div>
											<Field
												type="text"
												name="name"
												placeholder="Full Name"
												className="input w-full h-10 px-2 border border-slate-400 rounded-md"
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-sm text-red-500"
											/>
										</div>

										<div>
											<Field
												type="date"
												name="birthDate"
												className="input w-full h-10 px-2 border border-slate-400 rounded-md"
											/>
											<ErrorMessage
												name="birthDate"
												component="div"
												className="text-sm text-red-500"
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										<div>
											<Field
												as="select"
												name="gender"
												className="input w-full h-10 px-2 border border-slate-400 rounded-md"
											>
												<option value="">
													Select Gender
												</option>
												<option value="male">
													Male
												</option>
												<option value="female">
													Female
												</option>
												<option value="other">
													Other
												</option>
											</Field>
											<ErrorMessage
												name="gender"
												component="div"
												className="text-sm text-red-500"
											/>
										</div>

										<div>
											<Field
												type="tel"
												name="contact"
												placeholder="Contact Number"
												className="input w-full h-10 px-2 border border-slate-400 rounded-md"
											/>
											<ErrorMessage
												name="contact"
												component="div"
												className="text-sm text-red-500"
											/>
										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
									</div>

									<div className="flex items-center space-x-2">
										<Field
											type="checkbox"
											name="terms"
											className="h-4 w-4"
										/>
										<label
											htmlFor="terms"
											className="text-sm text-gray-600"
										>
											I agree to the{" "}
											<Link
												href="/term-condition"
												className="text-indigo-600 underline"
											>
												Terms & Conditions
											</Link>
										</label>
									</div>
									<ErrorMessage
										name="terms"
										component="div"
										className="text-sm text-red-500"
									/>

									<button
										type="submit"
										className=" w-full bg-indigo-500 text-white py-2 rounded  hover:bg-indigo-700 transition"
										disabled={isSubmitting}
									>
										{isSubmitting
											? "Submitting..."
											: "Sign Up"}
									</button>
									<p className="text-slate-500 text-center text-sm">
										Do you have an account ?{" "}
										<Link
											href={`/user/customer/auth/login`}
											className="text-indigo-500 hover:text-indigo-600"
										>
											Login
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

export default SignupPage;
