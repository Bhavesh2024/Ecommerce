"use client";
import Navbar from "@/layout/navbar/Navbar";

import "./globals.css";
import { useProduct } from "@/hooks/useProduct";
import PageLoader from "@/components/loader/PageLoader";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCustomerStoreActions } from "@/hooks/store/useCustomerStore";
import { useRouter } from "next/navigation";
import Contact from "@/components/section/Contact";
import Hero from "@/components/section/Hero";
import Collection from "@/components/section/Collection";
import dynamic from "next/dynamic";
import { ProductCardLoader } from "@/components/loader/CardLoader";
import Link from "next/link";
const ProductCard = dynamic(() => import("@/components/card/ProductCard"), {
	loading: () => <ProductCardLoader />,
	ssr: true,
});
export default function Home() {
	const { data, isSuccess, isError, isLoading } = useProduct(true, "all");
	const { data: authResponseData, isSuccess: isAuthSuccess } = useAuth(
		"login",
		"",
		true,
	);
	const { setValue } = useCustomerStoreActions();
	const [products, setProducts] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (isAuthSuccess && authResponseData) {
			const { user } = authResponseData;
			if (user.role == "admin") {
				router.push("/user/admin/");
			}
			setValue("user", user);
		}
	}, [isAuthSuccess, authResponseData]);

	useEffect(() => {
		if (isSuccess && data) {
			const { products } = data;
			setProducts(products);
		}
	}, [isSuccess, data]);

	return (
		<>
			<div className='fixed top-0 left-0 w-full z-50'>
				<Navbar />
			</div>

			{/* Premium Hero Section */}
			<Hero />

			{/* Genuine Product Categories */}
			<Collection />
			{isLoading && <PageLoader />}
			{/* Featured Products */}
			{isSuccess && (
				<section className='py-12 px-6 bg-purple-50'>
					<div className='max-w-6xl mx-auto'>
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8'>
							<div>
								<h2 className='text-2xl font-semibold text-gray-800'>
									Current Collection
								</h2>
								<p className='text-gray-500'>
									{products &&
										products.length}{" "}
									unique handmade pieces
									available
								</p>
							</div>
							<button
								onClick={() =>
									router.push("/products")
								}
								className='text-purple-600 hover:text-purple-800 font-medium mt-4 sm:mt-0'>
								Explore More Products →
							</button>
						</div>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{products &&
								products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
									/>
								))}
						</div>
					</div>
				</section>
			)}

			{/* Detailed Contact */}
			<section className='py-12 px-6'>
				<div className='max-w-4xl mx-auto text-center'>
					<h2 className='text-2xl font-semibold text-gray-800 mb-2 text-center'>
						Connect With Us
					</h2>
					<p className='text-gray-600 mb-8 max-w-xl mx-auto text-center'>
						Have questions or need help? We're here for
						you. Reach out to us anytime!
					</p>{" "}
					<Contact />
					<Link
						href={"/contact"}
						className='block w-fit mx-auto mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-medium transition-colors'>
						Send Us a Message
					</Link>
				</div>
			</section>
		</>
	);
}
