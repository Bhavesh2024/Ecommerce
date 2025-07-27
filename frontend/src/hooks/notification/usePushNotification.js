import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "@/config/firebase/firebaseClient";

export const initFCM = async () => {
	try {
		const messaging = getMessaging(app);

		const token = await getToken(messaging, {
			vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
		});
		return token;
	} catch (err) {
		console.error("FCM error", err);
	}
	return null;
};
