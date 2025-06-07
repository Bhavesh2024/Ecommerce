// hooks/usePopupMessage.js
import { useState, useCallback, useEffect } from "react";

export const usePopupMessage = () => {
	const [message, setMessage] = useState("");
	const [type, setType] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	// Success message handler
	const showSuccess = useCallback((msg) => {
		setMessage(msg);
		setType("success");
		setIsOpen(true);
	}, []);

	// Error message handler
	const showError = useCallback((msg) => {
		setMessage(msg);
		setType("error");
		setIsOpen(true);
	}, []);

	// Close popup and reset message
	const closePopup = useCallback(() => {
		setIsOpen(false);
		setMessage("");
		setType(null);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				if (type == "error") {
					setIsOpen(false);
				}
			}, 3000);
		}
	}, [isOpen, type]);
	// Return all the state and handlers
	return {
		message,
		type,
		isOpen,
		showSuccess,
		showError,
		closePopup,
	};
};
