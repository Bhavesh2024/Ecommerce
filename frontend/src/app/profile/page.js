"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import {
	useCustomerStoreActions,
	useCustomerStoreState,
} from "@/hooks/store/useCustomerStore";
import ProductNav from "@/layout/navbar/ProductNav";
import dynamic from "next/dynamic";
import { EditProfileFormLoader } from "@/components/loader/FormLoader";
const EditProfileForm = dynamic(
	() => import("@/components/form/profile/EditProfileForm"),
	{
		loading: () => <EditProfileFormLoader />,
		ssr: false,
	},
);

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
					<div className='grid grid-cols-1 lg:grid-cols-2'>
						<div className='hidden lg:flex items-center h-screen w-full'>
							<img
								src='/images/illustration/profile.svg'
								alt='Banner'
								className='h-10/12 w-full object-contain'
							/>
						</div>
						<div className='flex justify-center items-center w-full mt-16'>
							<EditProfileForm initialData={user} />
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Page;
