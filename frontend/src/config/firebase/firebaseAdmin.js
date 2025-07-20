// lib/firebaseAdmin.js
import admin from "firebase-admin";
const serviceAccount = require("./upsquare-firebase-admin-sdk.json"); // ✅ adjust path as needed

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export default admin;
