"use client";

import PageLoader from "@/components/loader/PageLoader";
import Alert from "@/components/modal/alert/Alert";
import Modal from "@/components/modal/Modal";
import Response from "@/components/modal/response/Response";
import NoItem from "@/components/not-found/NoItem";
import DataTable from "@/components/table/DataTable";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useUser } from "@/hooks/useUser";
import { handleUser } from "@/utils/api/userApi";
import { useMutation } from "@tanstack/react-query";
import { Users as People } from "lucide-react";
import React, { useEffect, useState } from "react";

const Users = () => {
	const { data, isSuccess, isLoading, isError } = useUser(true, "all");
	const { users } = useAdminStoreState();
	const { addAllItem, deleteItem } = useAdminStoreActions();
	const [id, setId] = useState(null);
	const [alert, setAlert] = useState(false);
	const { isOpen, closePopup, message, showError, showSuccess, type } =
		usePopupMessage();

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
						<People className='size-16 text-gray-500' />
					}
				/>
			)}
			{isSuccess && users && (
				<>
					<div className='w-full px-2 mt-4'>
						<DataTable
							data={userData}
							values={users}
							enablePagination={true}
							onDelete={(user) =>
								handleConfirmDelete(user.id)
							}
						/>
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
				open={isOpen}
				onClose={closePopup}>
				<Response
					message={message}
					onClose={closePopup}
					type={type}
				/>
			</Modal>
		</>
	);
};

export default Users;
