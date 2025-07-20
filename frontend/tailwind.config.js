/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Poppins", "sans-serif"], // general text
				logo: ["Pacifico", "cursive"], // specific for Upsquare logo
			},
			screens: {
				small: "576px",
				"small-max": { max: "767px" },
				"small-only": { min: "576px", max: "767px" },
			},
			scrollbars: {
				"scrollbar-hidden": { s },
			},
		},
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				".scrollbar-hidden": {
					/* Works for most modern browsers */
					"-ms-overflow-style": "none", // IE and Edge
					"scrollbar-width": "none", // Firefox
					"&::-webkit-scrollbar": {
						display: "none", // Chrome, Safari, Opera
					},
				},
			});
		}),
	],
};
