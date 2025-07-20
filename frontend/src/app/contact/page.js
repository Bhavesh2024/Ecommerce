"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from "@/layout/navbar/Navbar";
import { useMutation } from "@tanstack/react-query";
import { handleContact } from "@/utils/api/contactApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import Modal from "@/components/modal/Modal";
import PageLoader from "@/components/loader/PageLoader";
// import Response from "@/components/modal/response/Response";
import Contact from "@/components/section/Contact";
import Image from "next/image";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/modal/Modal"), {
	loading: () => <PageLoader />,
	ssr: false,
});
const Response = dynamic(() => import("@/components/modal/response/Response"), {
	loading: () => <PageLoader />,
	ssr: false,
});
const ContactSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	message: Yup.string().required("Message is required"),
});

const ContactPage = () => {
	const contactImage = "/images/contact/contact.svg";
	const {
		isOpen,
		showError,
		type,
		showSuccess,
		message,
		closePopup,
		loading,
		startLoading,
	} = usePopupMessage();
	const { mutate } = useMutation({
		mutationFn: handleContact,
		onSuccess: (response) => {
			showSuccess(response.message);
		},
		onError: (error) => {
			showError(error);
		},
	});

	const router = useRouter();

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				if (type == "success") {
					router.push("/");
				}
			}, 3000);
		}
	}, [isOpen]);
	return (
		<>
			<div className='w-full fixed top-0 start-0'>
				<Navbar />
			</div>
			<div className='grid mt-16  grid-cols-1 lg:grid-cols-2 min-h-fit w-full'>
				{/* Left Side - Image */}
				<div className='hidden lg:flex items-center justify-center'>
					{/* <img
						src='/images/contact/contact.svg'
						alt='Contact Illustration'
						className='w-full h-full xl:object-cover'
					/> */}
					<Image
						src={contactImage}
						height={100}
						width={100}
						alt='Contact Illustration'
						className='w-full h-full xl:object-cover'
					/>
				</div>

				{/* Right Side - Form & Info */}
				<div className='flex flex-col justify-center p-6 space-y-10 w-full max-w-3xl mx-auto'>
					{/* Contact Form */}
					<div>
						<h2 className='text-3xl font-semibold text-purple-600 mb-2'>
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
								startLoading();
								mutate({
									method: "post",
									type: "send",
									data: values,
								});
							}}>
							{({
								isSubmitting,
								errors,
								touched,
							}) => (
								<Form className='space-y-4'>
									{/* Name Field */}
									<div className='flex flex-col'>
										<Field
											type='text'
											name='name'
											placeholder='Your Name'
											className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
												errors.name &&
												touched.name
													? "border-red-500"
													: "border-gray-300 focus:border-purple-500"
											}`}
										/>
										<ErrorMessage
											name='name'
											component='div'
											className='text-sm text-red-500 mt-1'
										/>
									</div>

									{/* Email Field */}
									<div className='flex flex-col'>
										<Field
											type='email'
											name='email'
											placeholder='Your Email'
											className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
												errors.email &&
												touched.email
													? "border-red-500"
													: "border-gray-300 focus:border-purple-500"
											}`}
										/>
										<ErrorMessage
											name='email'
											component='div'
											className='text-sm text-red-500 mt-1'
										/>
									</div>

									{/* Message Field */}
									<div className='flex flex-col'>
										<Field
											as='textarea'
											name='message'
											placeholder='Your Message'
											rows='4'
											className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
												errors.message &&
												touched.message
													? "border-red-500"
													: "border-gray-300 focus:border-purple-500"
											}`}
										/>
										<ErrorMessage
											name='message'
											component='div'
											className='text-sm text-red-500 mt-1'
										/>
									</div>

									{/* Submit Button */}
									<button
										type='submit'
										className='w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition'
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
					{/* <div className='grid grid-cols-1 small-only:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
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
								className='flex flex-col items-center text-center bg-purple-600 text-white p-5 h-40 justify-center rounded-lg shadow-md'>
								<item.icon className='size-10 mb-2' />
								<p className='text-sm text-gray-200'>
									{item.text}
								</p>
							</div>
						))}
					</div> */}
					<Contact />
				</div>
			</div>
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{!loading && (
					<Response
						type={type}
						message={message}
						onClose={closePopup}
					/>
				)}
			</Modal>
		</>
	);
};

export default ContactPage;
