"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProductNav from "@/layout/navbar/ProductNav";
import Navbar from "@/layout/navbar/Navbar";

const ContactSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	message: Yup.string().required("Message is required"),
});

const ContactPage = () => {
	return (
		<>
			<div className='w-full fixed top-0 start-0'>
				<Navbar />
			</div>
			<div className='grid mt-16  grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-gray-50 '>
				{/* Left Side - Image */}
				<div className='hidden lg:flex items-center justify-center'>
					<img
						src='/images/contact/contact.jpeg'
						alt='Contact Illustration'
						className='w-full h-full object-contain'
					/>
				</div>

				{/* Right Side - Form & Info */}
				<div className='flex flex-col justify-center p-6 space-y-10 w-full max-w-3xl mx-auto'>
					{/* Contact Form */}
					<div>
						<h2 className='text-3xl font-semibold text-indigo-500 mb-2'>
							Contact Us
						</h2>
						<p className='text-gray-600 mb-6'>
							We’d love to hear from you. Please
							fill out the form.
						</p>

						<Formik
							initialValues={{
								name: "",
								email: "",
								message: "",
							}}
							validationSchema={ContactSchema}
							onSubmit={(values) => {
								console.log(
									"Form Submitted:",
									values,
								);
								alert(
									"Thank you for contacting us!",
								);
							}}>
							{({ isSubmitting }) => (
								<Form className='space-y-4'>
									<Field
										type='text'
										name='name'
										placeholder='Your Name'
										className='w-full p-3 border border-gray-300 rounded-md'
									/>
									<ErrorMessage
										name='name'
										component='div'
										className='text-sm text-red-500'
									/>

									<Field
										type='email'
										name='email'
										placeholder='Your Email'
										className='w-full p-3 border border-gray-300 rounded-md'
									/>
									<ErrorMessage
										name='email'
										component='div'
										className='text-sm text-red-500'
									/>

									<Field
										as='textarea'
										name='message'
										placeholder='Your Message'
										rows='4'
										className='w-full p-3 border border-gray-300 rounded-md'
									/>
									<ErrorMessage
										name='message'
										component='div'
										className='text-sm text-red-500'
									/>

									<button
										type='submit'
										className='w-full py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition'
										disabled={
											isSubmitting
										}>
										{isSubmitting
											? "Sending..."
											: "Send Message"}
									</button>
								</Form>
							)}
						</Formik>
					</div>

					{/* Info Cards */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{[
							{
								icon: MapPin,
								text: "123 Main Street, City",
							},
							{
								icon: Phone,
								text: "+1 234 567 890",
							},
							{
								icon: Mail,
								text: "contact@yourdomain.com",
							},
						].map((item, i) => (
							<div
								key={i}
								className='flex flex-col items-center text-center bg-indigo-500 text-white p-5 h-40 justify-center rounded-lg shadow-md'>
								<item.icon className='size-10 mb-2' />
								<p className='text-sm text-gray-200'>
									{item.text}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default ContactPage;
