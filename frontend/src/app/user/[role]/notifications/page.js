"use client";

import { useNotification } from "@/hooks/notification/useNotification";
import React, { useState, useEffect, useRef } from "react";
import PageLoader from "@/components/loader/PageLoader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BellPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { handleNotification } from "@/utils/api/notificationApi";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import dynamic from "next/dynamic";
import {
	NoItemLoader,
	NotificationGroupLoader,
} from "@/components/loader/ItemLoader";
dayjs.extend(relativeTime);
import { groupNotificationsByTime } from "@/utils/helper/group";
const NotificationGroup = dynamic(
	() => import("@/components/item/group/NotificationGroup"),
	{
		ssr: true,
		loading: () => <NotificationGroupLoader />,
	},
);
const Modal = dynamic(() => import("@/components/modal/Modal"), {
	ssr: false,
});
const Response = dynamic(() => import("@/components/modal/response/Response"), {
	ssr: false,
});

const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});
const NotificationPage = () => {
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

export default NotificationPage;
