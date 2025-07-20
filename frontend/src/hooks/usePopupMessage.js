import { useState, useCallback, useEffect } from "react";

export const usePopupMessage = () => {
	const [message, setMessage] = useState("");
	const [type, setType] = useState(null); // 'success' | 'error' | null
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	// Success message handler
	const showSuccess = useCallback((msg) => {
		setMessage(msg);
		setType("success");
		setIsOpen(true);
		setLoading(false); // stop loading on success
	}, []);

	// Error message handler
	const showError = useCallback((msg) => {
		setMessage(msg);
		setType("error");
		setIsOpen(true);
		setLoading(false); // stop loading on error
	}, []);

	// Start loading manually
	const startLoading = useCallback(() => {
		setLoading(true);
		setIsOpen(false);
		setMessage("");
		setType(null);
	}, []);

	// Close popup manually
	const closePopup = useCallback(() => {
		setIsOpen(false);
		setMessage("");
		setType(null);
	}, []);

	// Auto-close error messages after 3 seconds
	useEffect(() => {
		if (isOpen && type === "error") {
			const timer = setTimeout(() => {
				setIsOpen(false);
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [isOpen, type]);

	return {
		message,
		type,
		isOpen,
		loading,
		showSuccess,
		showError,
		startLoading,
		closePopup,
	};
};
