"use client";
import Navbar from "@/layout/navbar/Navbar";
// import { products } from "@/utils/product";
import ProductCard from "@/components/card/ProductCard";
import "./globals.css";
import { useProduct } from "@/hooks/useProduct";
import PageLoader from "@/components/loader/PageLoader";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCustomerStoreActions } from "@/hooks/store/useCustomerStore";
import { useRouter } from "next/navigation";

export default function Home() {
	const { data, isSuccess, isError, isLoading } = useProduct(true, "all");
	const { data: authResponseData, isSuccess: isAuthSuccess } =
		useAuth(true);
	const { setValue } = useCustomerStoreActions();
	const [products, setProducts] = useState([]);
	const router = useRouter();

	useEffect(() => {
		if (isAuthSuccess && authResponseData) {
			const { user } = authResponseData;
			if (user.role == "admin") {
				router.push("/user/admin/");
			}
			// console.log("my", user);
			setValue("user", user);
		}
	}, [isAuthSuccess, authResponseData]);

	useEffect(() => {
		if (isSuccess && data) {
			const { products } = data;
			console.log("products", products);
			setProducts(products);
		}
	}, [isSuccess, data]);

	return (
		<>
			{isLoading && <PageLoader />}
			{isError && (
				<div className='h-screen flex items-center justify-center'>
					No Product Founds
				</div>
			)}
			<div className='fixed top-0 left-0 w-full'>
				<Navbar />
			</div>
			{isSuccess && (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 mt-16'>
					{products &&
						products.length > 0 &&
						products.map((product) => (
							<ProductCard
								key={product.title}
								product={product}
							/>
						))}
				</div>
			)}
		</>
	);
}
