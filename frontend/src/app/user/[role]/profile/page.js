"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import {
	useAdminStoreState,
	useAdminStoreActions,
} from "@/hooks/store/useAdminStore";
import dynamic from "next/dynamic";
import { EditProfileFormLoader } from "@/components/loader/FormLoader";
const EditProfileForm = dynamic(
	() => import("@/components/form/profile/EditProfileForm"),
	{
		ssr: true,
		loading: () => <EditProfileFormLoader />,
	},
);

const Page = () => {
	const { data, isSuccess, isError, isLoading } = useAuth(
		"login",
		"",
		true,
	);
	const { user } = useAdminStoreState();
	const { setValue } = useAdminStoreActions();
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
			{user && <EditProfileForm initialData={user} />}
		</>
	);
};

export default Page;
