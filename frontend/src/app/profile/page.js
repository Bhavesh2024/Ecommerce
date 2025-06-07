"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import {
	useCustomerStoreActions,
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import EditProfileForm from "@/components/form/profile/EditProfileForm";
import ProductNav from "@/layout/navbar/ProductNav";

const Page = () => {
	const { data, isSuccess, isError, isLoading } = useAuth();
	const { user } = useCustomerStoreState();
	const { setValue } = useCustomerStoreActions();
	useEffect(() => {
		if (data && isSuccess) {
			const { user } = data;
			setValue("user", user);
		}
	}, [data, isSuccess]);
	return (
		<>
			{isLoading && <PageLoader />}
			{isError && <NotFound />}
			{isSuccess && user && (
				<>
					<div className='fixed top-0 left-0 w-full'>
						<ProductNav />
					</div>{" "}
					<div className='h-screen flex justify-center items-center w-full'>
						<EditProfileForm initialData={user} />
					</div>
				</>
			)}
		</>
	);
};

export default Page;
