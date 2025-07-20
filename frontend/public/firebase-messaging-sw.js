// public/firebase-messaging-sw.js
importScripts(
	"https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js",
);

// HARDCODE the config — you CANNOT use process.env here
firebase.initializeApp({
	apiKey: "AIzaSyDPW7CI9Q_74Co_WF13ESgmPUoie9dYJAQ",
	authDomain: "upsquare-a7e3d.firebaseapp.com",
	projectId: "upsquare-a7e3d",
	storageBucket: "upsquare-a7e3d.firebasestorage.app",
	messagingSenderId: "831343697490",
	appId: "1:831343697490:web:50b4b5de3078b10cec098b",
	measurementId: "G-KZTZJGQB0Q",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	const notificationTitle = payload.notification?.title || "Notification";
	const notificationOptions = {
		body: payload.notification?.body || "You have a new message.",
		// icon: "/firebase-logo.png", // Optional icon
	};

	self.registration.showNotification(
		notificationTitle,
		notificationOptions,
	);
});
