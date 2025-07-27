import React from "react";
const StatusBadge = ({ value, list }) => {
	const match = list.find((s) => s.value === value);
	return match ? (
		<span
			className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${match.bg} ${match.text}`}>
			{match.label}
		</span>
	) : null;
};

export default StatusBadge;
