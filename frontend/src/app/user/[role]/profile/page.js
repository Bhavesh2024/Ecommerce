"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import {
	useAdminStoreState,
	useAdminStoreActions,
} from "@/hooks/store/useAdminStore";
import EditProfileForm from "@/components/form/profile/EditProfileForm";

const Page = () => {
	const { data, isSuccess, isError, isLoading } = useAuth(true);
	const { user } = useAdminStoreState();
	const { setValue } = useAdminStoreActions();
	useEffect(() => {
		if (data && isSuccess) {
			const { user } = data;
			setValue("user", user);
		}
	}, [data, isSuccess]);

	useEffect(() => {
		console.log(user);
	}, [user]);
	return (
		<>
			{isLoading && <PageLoader />}
			{isError && <NotFound />}
			{user && <EditProfileForm initialData={user} />}
		</>
	);
};

export default Page;
