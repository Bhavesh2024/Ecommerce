export function capitalizeWords(str) {
	return str
		.split(" ")
		.map((word) => capitalize(word))
		.join(" ");
}
