"use client";

import Header from "@/components/header/Header";
import DataTableLoader from "@/components/loader/DataTableLoader";
import { NoItemLoader } from "@/components/loader/ItemLoader";
import PageLoader from "@/components/loader/PageLoader";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useUser } from "@/hooks/useUser";
import { handleUser } from "@/utils/api/userApi";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { Users as People } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const DataTable = dynamic(() => import("@/components/table/DataTable"), {
	ssr: true,
	loading: () => <DataTableLoader />,
});

const Modal = dynamic(() => import("@/components/modal/Modal"), {
	ssr: false,
});

const Response = dynamic(() => import("@/components/modal/response/Response"), {
	ssr: false,
});

const Alert = dynamic(() => import("@/components/modal/alert/Alert"), {
	ssr: false,
});

const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});
const Users = () => {
	const { data, isSuccess, isLoading, isError } = useUser(true, "all");
	const { users } = useAdminStoreState();
	const { addAllItem, deleteItem } = useAdminStoreActions();
	const [id, setId] = useState(null);
	const [alert, setAlert] = useState(false);
	const {
		isOpen,
		closePopup,
		message,
		showError,
		showSuccess,
		type,
		startLoading,
		loading,
	} = usePopupMessage();

	const { mutate: removeUserMutation } = useMutation({
		mutationFn: handleUser,
		onSuccess: (data) => {
			const { id } = data;
			showSuccess("User Removed Successfully");
			deleteItem("users", parseInt(id));
		},
		onError: (err) => {
			showError(err);
		},
		onSettled: () => {
			setTimeout(() => {
				closePopup();
			}, 3000);
		},
	});

	useEffect(() => {
		if (data && isSuccess) {
			const { users } = data;
			addAllItem("users", users);
		}
	}, [data, isSuccess]);

	const handleConfirmDelete = (id) => {
		setId(id);
		setAlert(true);
	};

	const handleDelete = () => {
		setAlert(false);
		startLoading();
		removeUserMutation({ method: "delete", type: "remove", id: id });
	};
	const userData = [
		{
			key: "id",
			name: "Id",
			render: (data, row, index) => index + 1,
		},
		{
			key: "image",
			name: "Profile",
			render: (image) => (
				<img
					src={
						image
							? image
							: "/images/default/profile.svg"
					}
					className='size-12 rounded-full'
				/>
			),
		},
		{
			key: "name",
			name: "Name",
		},
		{
			key: "birthDate",
			name: "Birth Date",
			render: (val) => format(new Date(val), "dd MMM yyyy"),
		},
		{
			key: "gender",
			name: "Gender",
			render: (gender) => (
				<span className='capitalize'>{gender}</span>
			),
		},
		{
			key: "email",
			name: "Email",
		},
		{
			key: "phone",
			name: "Phone Number",
		},
	];
	return (
		<>
			{isLoading && <PageLoader />}
			{isError && (
				<NoItem
					message={"No User Found"}
					icon={
						<People className='size-16 text-purple-500' />
					}
				/>
			)}
			{isSuccess && users && (
				<>
					<div className='flex flex-col gap-2 w-11/12 mx-auto'>
						<Header
							title='User'
							enableBtn={false}
						/>
						<div className='w-full px-2 mt-4'>
							<DataTable
								data={userData}
								values={users}
								enablePagination={true}
								onDelete={(user) =>
									handleConfirmDelete(
										user.id,
									)
								}
							/>
						</div>
					</div>
				</>
			)}

			<Modal
				open={alert}
				onClose={() => setAlert(false)}>
				<Alert
					isOpen={alert}
					title={"Delete"}
					message={"Are you sure to Delete User ?"}
					onCancel={() => setAlert(false)}
					onConfirm={handleDelete}
				/>
			</Modal>
			<Modal
				open={loading || isOpen}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						message={message}
						onClose={closePopup}
						type={type}
					/>
				)}
			</Modal>
		</>
	);
};

export default Users;
