import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export const sendMail = async ({
	to,
	subject,
	template,
	replacements = {},
}) => {
	const mailFiles = {
		otpVerification: "verificationCode",
		register: "welcome",
		newOrder: "orderPlaced",
		cancelOrder: "orderCancel",
		deliveredOrder: "orderDelivered",
		contact: "contactMail",
	};
	const mailSubject = {
		passwordReset: "Your Password Reset Code - Upsquare Art",
		welcome: "Welcome to Upsquare Art! Let's Get Started",
		orderPlaced: "Order Confirmation - Thank You for Shopping with Us",
		orderCanceled: "Your Order Has Been Canceled - Upsquare Art",
		contactMail: "New Form Submission - Upsquare Art",
		orderDelivered:
			"Your Order Has Been Delivered - Enjoy Your Purchase",
	};

	try {
		const templatePath = path.join(
			process.cwd(),
			"src",
			"utils",
			"templates",
			`${mailFiles[template]}.html`,
		);
		let html = fs.readFileSync(templatePath, "utf-8");

		// Default replacements
		const defaultReplacements = {
			logo: "https://res.cloudinary.com/dyu19wgl0/image/upload/v1742731965/glaxora/fgjtuykryd5v08k3zia4.jpg",
			year: new Date().getFullYear(),
		};

		const allReplacements = {
			...defaultReplacements,
			...replacements,
			phone: replacements.phone || "",
			phoneDisplayClass: replacements.phone ? "" : "hidden",
		};

		// Replace placeholders
		for (const key in allReplacements) {
			const regex = new RegExp(`{{${key}}}`, "g");
			html = html.replace(regex, allReplacements[key]);
		}

		// Send email
		await transporter.sendMail({
			from: `${process.env.MAIL_USER}`,
			to,
			subject: mailSubject[subject],
			html,
		});
		return {
			success: true,
			error: false,
			message: "Mail Sent Successfully",
		};
	} catch (err) {
		console.error("Error sending email:", err);
		return {
			success: false,
			error: true,
			message: "Failed to Send Mail",
		};
	}
};
