export const cookieOptions = {
	name: "upsquareToken",
	value: "",
	maxAge: 0,
	sameSite: "strict",
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
};
