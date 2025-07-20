"use client";
import { useCustomerStoreActions } from "@/hooks/store/useCustomerStore";
import { useAuth } from "@/hooks/useAuth";
import { useProduct } from "@/hooks/useProduct";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import ProductNav from "@/layout/navbar/ProductNav";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CheckoutFormLoader } from "@/components/loader/FormLoader";

const CheckoutForm = dynamic(
	() => import("@/components/form/checkout/CheckoutForm"),
	{
		ssr: true,
		loading: () => <CheckoutFormLoader />,
	},
);

const Page = () => {
	const { slug } = useParams();
	const {
		data: authResponseData,
		isSuccess: isAuthSuccess,
		isError: isAuthError,
		isLoading: isAuthLoading,
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
			setValue(user);
		}
	}, [isAuthSuccess, authResponseData]);

	// Show loader if either auth or product is loading
	if (isLoading || isAuthLoading) {
		return <PageLoader />;
	}

	// Show not found if:
	// - product fetch failed OR
	// - user is not authenticated OR
	// - auth check failed
	if (isError || isAuthError || !isAuthSuccess) {
		return (
			<>
				<div className='fixed top-0 left-0 w-full'>
					<ProductNav />
				</div>
				<NotFound
					title='401'
					heading="You're not logged in"
					message='Please log in to continue to the checkout.'
				/>
			</>
		);
	}

	// Only show checkout form if:
	// - user is authenticated (isAuthSuccess) AND
	// - product data is available
	return (
		<>
			<div className='fixed top-0 left-0 w-full'>
				<ProductNav />
			</div>
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
