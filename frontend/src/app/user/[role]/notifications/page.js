"use client";

import { useNotification } from "@/hooks/notification/useNotification";
import React, { useState, useEffect, useRef } from "react";
import PageLoader from "@/components/loader/PageLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NoItem from "@/components/not-found/NoItem";
import {
	BellPlus,
	MoreVertical,
	Eye,
	Trash2,
	User as UserIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { handleNotification } from "@/utils/api/notificationApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Alert from "@/components/modal/alert/Alert";
import Modal from "@/components/modal/Modal";
import Response from "@/components/modal/response/Response";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
dayjs.extend(relativeTime);

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

const NotificationGroup = ({
	groupName,
	notifications,
	onDelete,
	isExpanded,
	onToggle,
}) => {
	return (
		<div className='mb-6'>
			<div
				className='flex justify-between items-center mb-3 cursor-pointer'
				onClick={onToggle}>
				<h2 className='text-lg font-semibold text-slate-800'>
					{groupName}
				</h2>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full'>
						{notifications.length}
					</span>
					<svg
						className={`w-4 h-4 text-slate-500 transition-transform ${
							isExpanded ? "rotate-180" : ""
						}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</div>
			</div>

			{isExpanded && (
				<ul className='space-y-3'>
					{notifications.map((notification) => (
						<NotificationItem
							key={notification.id}
							notification={notification}
							onDelete={onDelete}
							router={useRouter()}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

const NotificationPage = () => {
	const router = useRouter();
	const [skip, setSkip] = useState(0);
	const limit = 20;
	const [expandedGroups, setExpandedGroups] = useState({});
	const {
		message,
		type,
		isOpen,
		showError,
		showSuccess,
		loading,
		startLoading,
		closePopup,
	} = usePopupMessage();

	// Get store actions and state
	const { deleteItem, addAllItem } = useAdminStoreActions();
	const { notifications: storeNotifications } = useAdminStoreState();

	const { data, isLoading, isError, mutate } = useNotification({
		limit,
		skip,
		link: "all",
	});

	// Initialize store with notifications when data is fetched
	useEffect(() => {
		if (data?.notifications) {
			addAllItem("notifications", data.notifications);
		}
	}, [data?.notifications, addAllItem]);

	const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
		mutationFn: handleNotification,
		onSuccess: (data) => {
			// Optimistically remove from Zustand store
			deleteItem("notifications", data.id);
			// Show success message
			setTimeout(() => {
				closePopup();
			}, 3000);
			showSuccess(data.message);
		},
		onError: (err) => {
			showError(err.message);
			// Re-fetch notifications to restore state if deletion failed
			mutate();
		},
	});

	// Infinite scroll hook
	const containerRef = useRef(null);
	useInfiniteScroll({
		containerRef,
		loadMore: () => {
			if (data?.hasMore) {
				setSkip((prev) => prev + limit);
			}
		},
		threshold: 200,
	});

	const handleDelete = (id) => {
		startLoading();
		deleteMutation({ method: "delete", type: "delete", id });
	};

	const toggleGroup = (groupName) => {
		setExpandedGroups((prev) => ({
			...prev,
			[groupName]: !prev[groupName],
		}));
	};

	// Use store notifications if available, otherwise fall back to API data
	const notificationsToDisplay =
		storeNotifications.length > 0
			? storeNotifications
			: data?.notifications || [];

	const groupedNotifications = groupNotificationsByTime(
		notificationsToDisplay,
	);

	if (isLoading && skip === 0) return <PageLoader />;
	if (isError)
		return (
			<NoItem
				message={"No Notifications Found"}
				icon={<BellPlus className='size-16 text-purple-500' />}
			/>
		);

	return (
		<div
			className='p-4 w-full max-w-4xl mx-auto'
			ref={containerRef}>
			<h1 className='text-2xl font-bold text-slate-800 mb-6'>
				Notifications
			</h1>

			{groupedNotifications.map(([groupName, notifications]) => (
				<NotificationGroup
					key={groupName}
					groupName={groupName}
					notifications={notifications}
					onDelete={handleDelete}
					isExpanded={expandedGroups[groupName] !== false}
					onToggle={() => toggleGroup(groupName)}
				/>
			))}

			{(isLoading || isDeleting) && (
				<div className='flex justify-center py-4'>
					<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500'></div>
				</div>
			)}

			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						message={message}
						type={type}
						onClose={closePopup}
					/>
				)}
			</Modal>
		</div>
	);
};

function groupNotificationsByTime(notifications) {
	const now = dayjs();
	const groups = {
		Today: [],
		Yesterday: [],
		"This Week": [],
		"Week Ago": [],
		"This Month": [],
		"Month Ago": [],
		"This Year": [],
		"Year Ago": [],
	};

	notifications.forEach((notification) => {
		const date = dayjs(notification.createdAt);
		const diffDays = now.diff(date, "day");
		const diffWeeks = now.diff(date, "week");
		const diffMonths = now.diff(date, "month");
		const diffYears = now.diff(date, "year");

		if (diffDays === 0) groups.Today.push(notification);
		else if (diffDays === 1) groups.Yesterday.push(notification);
		else if (diffDays <= 7) groups["This Week"].push(notification);
		else if (diffWeeks === 1) groups["Week Ago"].push(notification);
		else if (diffMonths === 0) groups["This Month"].push(notification);
		else if (diffMonths === 1) groups["Month Ago"].push(notification);
		else if (diffYears === 0) groups["This Year"].push(notification);
		else if (diffYears === 1) groups["Year Ago"].push(notification);
	});

	return Object.entries(groups).filter(([_, items]) => items.length > 0);
}

export default NotificationPage;
