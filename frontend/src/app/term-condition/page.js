// components/TermsAndConditions.jsx
"use client";
import React from "react";
import {
	ShieldCheck,
	ShoppingCart,
	Truck,
	Ban,
	Undo2,
	User,
	Mail,
	Phone,
} from "lucide-react";
import Navbar from "@/layout/navbar/Navbar";

const TermsAndConditions = () => {
	return (
		<>
			<div className="fixed w-full top-0 start-0">
				<Navbar />
			</div>
			<div className="w-11/12 md:w-10/12 lg:w-3/4 mx-auto px-4 py-10 text-gray-800">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Terms & Conditions
				</h1>

				{/* Business Scope */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<ShieldCheck className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							1. Business Scope
						</h2>
					</div>
					<p>
						Upsquare operates locally in{" "}
						<strong>Mehsana, Gujarat</strong>. We offer custom
						unisex products like Handmade Wooden Sketches, Blood
						Art, Customized Pendant Neck/Hand Art, Couple Gift Art,
						and Customized Candles.
					</p>
				</section>

				{/* Ordering Process */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<ShoppingCart className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							2. Ordering Process
						</h2>
					</div>
					<ul className="list-disc ml-6 space-y-1">
						<li>Create or log in to an account.</li>
						<li>Select a product and choose variants.</li>
						<li>Fill in checkout details.</li>
						<li>Receive confirmation via email.</li>
						<li>
							Gift pack and frame charges (if applicable) are
							shown during checkout.
						</li>
						<li>
							Product is delivered, and after COD payment, order
							is marked complete.
						</li>
					</ul>
				</section>

				{/* Delivery */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<Truck className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">3. Delivery</h2>
					</div>
					<p>
						Delivery takes <strong>2 to 4 working days</strong>. If
						within Mehsana, it may be earlier. Delivery is limited
						to specific areas.
					</p>
				</section>

				{/* Cancellation Policy */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<Ban className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							4. Cancellation Policy
						</h2>
					</div>
					<p>
						Cancellations are only accepted via our{" "}
						<strong>Contact Form</strong> before dispatch. Direct
						dashboard or phone cancellations are not supported.
					</p>
				</section>

				{/* Return & Refund */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<Undo2 className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							5. Return & Refund Policy
						</h2>
					</div>
					<p>
						Products are not exchangeable. Returns/refunds are only
						available if the product is{" "}
						<strong>damaged or broken</strong> on delivery. Proof
						must be submitted within 24 hours.
					</p>
				</section>

				{/* Customer Data */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<User className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							6. Customer Data & Privacy
						</h2>
					</div>
					<ul className="list-disc ml-6 space-y-1">
						<li>Name, gender, birthdate for customer ID.</li>
						<li>Email for order confirmation.</li>
						<li>Phone number for delivery updates.</li>
						<li>Address only during checkout for shipping.</li>
						<li>Data is used only for order processing.</li>
					</ul>
				</section>

				{/* Contact Info */}
				<section className="mb-8">
					<div className="flex items-center mb-2">
						<Mail className="text-red-500 mr-2" />
						<h2 className="text-xl font-semibold">
							7. Contact Information
						</h2>
					</div>
					<ul className="ml-6">
						<li className="flex items-center">
							<Mail className="w-4 h-4 mr-2" />
							Email:{" "}
							<span className="ml-1">
								[your-email@example.com]
							</span>
						</li>
						<li className="flex items-center mt-1">
							<Phone className="w-4 h-4 mr-2" />
							Phone/WhatsApp:{" "}
							<span className="ml-1">[your-phone-number]</span>
						</li>
						<li className="mt-1">
							Use our website contact form for support.
						</li>
					</ul>
				</section>
			</div>
		</>
	);
};

export default TermsAndConditions;
