export const products = [
	{
		id: "1",
		title: "Handmade Wooden Sketch",
		category: "Art & Craft",
		images: ["handmade-wooden-sketch-a5.png"],
		price: {
			single: {
				A5: "999",
				A4: "1299",
				A3: "1599",
				A2: "1999",
			},
			couple: {
				A5: "1499",
				A4: "1799",
				A3: "2099",
				A2: "2499",
			},
		},
		description:
			"A beautifully handcrafted wooden sketch in multiple sizes, perfect for home decor or gifts.",
		extras: [
			{ name: "Frame", price: "199" },
			{ name: "Gift Wrapping", price: "49" },
		],
		stock: "In Stock",
	},
	{
		id: "2",
		title: "Blood Art",
		category: "Art & Craft",
		images: ["blood-art.png"],
		price: {
			single: {
				A5: "1499",
				A4: "1799",
				A3: "1999",
				A2: "2499",
			},
			couple: {
				A5: "1999",
				A4: "2299",
				A3: "2599",
				A2: "2999",
			},
		},
		description:
			"Unique blood art created on premium quality paper, available in multiple sizes.",
		extras: [
			{ name: "Frame", price: "299" },
			{ name: "Gift Wrapping", price: "49" },
		],
		stock: "In Stock",
	},
	{
		id: "3",
		title: "Customized Pandel Neck/Hand",
		category: "Accessories",
		images: ["customize-pendant.png"],
		price: {
			single: "649",
			couple: "999",
		},
		description:
			"Personalized Pandel for neck/hand, perfect as a gift or accessory.",
		extras: [{ name: "Gift Wrapping", price: "49" }],
		stock: "In Stock",
	},
	{
		id: "4",
		title: "Handmade Sketch",
		category: "Art & Craft",
		images: ["hand-made-sketch.png"],
		price: {
			single: {
				A5: "999",
				A4: "1499",
				A3: "1999",
				A2: "2499",
			},
			couple: {
				A5: "1499",
				A4: "1999",
				A3: "2499",
				A2: "2999",
			},
		},
		description:
			"Realistic and hyper-realistic handmade sketches in different sizes.",
		extras: [
			{ name: "Frame", price: "499" },
			{ name: "Gift Wrapping", price: "49" },
		],
		stock: "Out of Stock",
	},
	{
		id: "5",
		title: "Couple Gifts Art",
		category: "Gifts",
		images: ["couple-gift-art.png"],
		price: {
			single: "2499",
			couple: "2999",
		},
		description:
			"A special piece of art for couples, personalized to make memorable moments.",
		extras: [
			{ name: "Frame", price: "399" },
			{ name: "Gift Wrapping", price: "49" },
		],
		stock: "In Stock",
	},
	{
		id: "6",
		title: "Customized Candles",
		category: "Gifts",
		images: ["customize-candle.png"],
		price: {
			single: "499",
			couple: "799",
		},
		description:
			"Beautifully customized candles for any occasion, perfect as gifts.",
		extras: [{ name: "Gift Wrapping", price: "49" }],
		stock: "In Stock",
	},
];
