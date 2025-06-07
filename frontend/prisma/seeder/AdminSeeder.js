// seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const askQuestion = (question) => {
	return new Promise((resolve) => rl.question(question, resolve));
};

const createAdmin = async () => {
	try {
		console.log("--- Create Admin User ---");

		const name = await askQuestion("Name: ");
		const email = await askQuestion("Email: ");
		const passwordInput = await askQuestion("Password: ");
		const phone = await askQuestion("Phone: ");
		const role = await askQuestion("Role (e.g., ADMIN): ");
		const gender = await askQuestion("Gender: ");
		const birthdateInput = await askQuestion(
			"Birthdate (YYYY-MM-DD): ",
		);

		const hashedPassword = await bcrypt.hash(passwordInput, 10);
		const birthdate = new Date(birthdateInput);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phone,
				role,
				agreeTerms: true,
				gender,
				birthdate,
			},
		});

		console.log("Admin user created successfully:", user);
	} catch (err) {
		console.error("Error creating admin user:", err.message);
	} finally {
		rl.close();
		await prisma.$disconnect();
	}
};

createAdmin();
