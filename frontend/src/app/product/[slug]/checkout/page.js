"use client";
import {
	useCustomerStoreActions,
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import { useAuth } from "@/hooks/useAuth";
import { useProduct } from "@/hooks/useProduct";
import CheckoutForm from "@/components/form/checkout/CheckoutForm";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import ProductNav from "@/layout/navbar/ProductNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
	const { slug } = useParams();
	const { user } = useCustomerStoreState();
	const {
		data: authResponseData,
		isSuccess: isAuthSuccess,
		isError: isAuthError,
	} = useAuth();
	const { setValue } = useCustomerStoreActions();
	const { data, isSuccess, isLoading, isError } = useProduct(
		true,
		`${slug}`,
	);

	const [product, setProduct] = useState(null);
	useEffect(() => {
		if (isSuccess && data) {
			const { product } = data;
			setProduct(product);
		}
	}, [isSuccess, data]);

	useEffect(() => {
		if (isAuthSuccess && authResponseData) {
			const { user } = authResponseData;
			console.log(user);
			setValue(user);
		}
	}, [isAuthSuccess, authResponseData]);

	return (
		<>
			<div className='fixed top-0 left-0 w-full'>
				<ProductNav />
			</div>
			{isLoading && <PageLoader />}
			{(isError || isAuthError) && <NotFound />}
			{product && authResponseData && (
				<div className='mt-20'>
					<CheckoutForm
						product={product}
						user={authResponseData.user}
					/>
				</div>
			)}
		</>
	);
};

export default Page;
