"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { MoreVertical, Eye, Trash2, User as UserIcon } from "lucide-react";
const Modal = dynamic(() => import("../modal/Modal"), {
	ssr: false,
});
const Alert = dynamic(() => import("../modal/alert/Alert"), {
	ssr: false,
});
import dayjs from "dayjs";

const NotificationItem = ({ notification, onDelete, router }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [alert, setAlert] = useState(false);
	const [deletingId, setDeletingId] = useState(null);
	const dropdownRef = useRef(null);
	const { role } = useParams();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleDeleteClick = (id) => {
		setDeletingId(id);
		setAlert(true);
	};

	const confirmDelete = () => {
		onDelete(deletingId);
		setAlert(false);
		setShowDropdown(false);
	};

	return (
		<li className='border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white'>
			<div className='flex items-center gap-3'>
				<div className='flex-shrink-0'>
					{notification.user?.image ? (
						<img
							src={notification.user.image}
							alt={notification.user.name}
							className='w-10 h-10 rounded-full object-cover border border-slate-200'
						/>
					) : (
						<div className='w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center'>
							<UserIcon className='w-5 h-5 text-purple-600' />
						</div>
					)}
				</div>
				<div className='flex-1'>
					<div className='flex justify-between items-start'>
						<div>
							{notification.user && (
								<h3 className='font-medium text-slate-800'>
									{notification.user.name}
								</h3>
							)}
							<p className='text-slate-600 mt-1 text-sm'>
								{notification.message}
							</p>
							<div className='text-xs text-slate-400 mt-2'>
								{dayjs(
									notification.createdAt,
								).format("h:mm A")}{" "}
								•{" "}
								{dayjs(
									notification.createdAt,
								).fromNow()}
							</div>
						</div>
						<div
							className='relative flex items-center my-auto'
							ref={dropdownRef}>
							<button
								className='text-slate-400 hover:text-slate-600'
								onClick={() =>
									setShowDropdown(
										!showDropdown,
									)
								}>
								<MoreVertical className='w-5 h-5' />
							</button>
							{showDropdown && (
								<div className='absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-slate-200'>
									{notification.orderId && (
										<button
											className='flex items-center w-full px-3 py-2 text-sm text-purple-700 hover:bg-slate-50'
											onClick={() => {
												router.push(
													`/user/${role}/orders/${notification.orderId}/view`,
												);
												setShowDropdown(
													false,
												);
											}}>
											<Eye className='w-4 h-4 mr-2 text-purple-500' />
											View
										</button>
									)}
									<button
										className='flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-slate-50'
										onClick={() =>
											handleDeleteClick(
												notification.id,
											)
										}>
										<Trash2 className='w-4 h-4 mr-2' />
										Delete
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<Modal
				open={alert}
				onClose={() => setAlert(false)}>
				<Alert
					onConfirm={confirmDelete}
					onCancel={() => {
						setAlert(false);
						setDeletingId(null);
					}}
					message={
						"Are you sure you want to delete this notification?"
					}
					isOpen={alert}
					title={"Delete Notification"}
				/>
			</Modal>
		</li>
	);
};

export default NotificationItem;
