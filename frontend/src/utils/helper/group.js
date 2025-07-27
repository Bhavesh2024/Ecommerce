import dayjs from "dayjs";
export function groupNotificationsByTime(notifications) {
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
