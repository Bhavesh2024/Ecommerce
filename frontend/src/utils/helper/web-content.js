import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { Gem, Brush, Shirt, Droplets, Gift, Leaf } from "lucide-react";
export const phoneNumbers = [
	{
		countryCode: "+91",
		phone: "12345 67890",
		icon: Phone,
	},
	{
		countryCode: "+91",
		phone: "14365 87809",
		icon: Phone,
	},
];

export const emailAddress = {
	link: "mailto:upsquareArt@gmail.com",
	icon: Mail,
	email: "upsquareArt@gmail.com",
};

export const location = {
	link: "https://maps.google.com/?q=C3+Compartment,Upsquare+Art",
	icon: MapPin,
	address: "C3 Compartment, Upsquare Art",
};

export const workHours = {
	weekdays: "Mon - Fri: 10:00 AM - 7:00 PM",
	weekends: "Sat - Sun: 11:00 AM - 5:00 PM",
};
export const socialMedia = [
	{
		name: "Facebook",
		link: "https://facebook.com/upsquareArt",
		icon: FaFacebook,
	},
	{
		name: "Instagram",
		link: "https://instagram.com/upsquareArt",
		icon: FaInstagram,
	},
	{
		name: "WhatsApp",
		link: "https://wa.me/911234567890",
		icon: FaWhatsapp,
	},
];

export const defaultImageUrl = "/images/default/user.png";
export const defaultImage = "/images/default/profile.png";
export const defaultProductImage = "images/default/product.webp";
export const categoryIcons = [Gem, Brush, Shirt, Droplets, Gift];
export const collectionIcons = [
	{
		icon: Leaf,
		name: "Wooden Art",
		desc: "Hand-carved from reclaimed teak and oak, each piece showcases natural wood grain",
	},
	{
		icon: Brush,
		name: "Handmade Sketches",
		desc: "Original charcoal and ink drawings on archival paper",
	},
	{
		icon: Gem,
		name: "Artisan Pendants",
		desc: "Unique jewelry featuring hand-engraved wooden and metal elements",
	},
	{
		icon: Droplets,
		name: "Blood Art",
		desc: "Symbolic pieces using iron oxide pigments for deep red tones",
	},
	{
		icon: Shirt,
		name: "Couple Wear",
		desc: "Matching t-shirts and shoes with hand-printed designs",
	},
	{
		icon: Gift,
		name: "Gift Wrapping",
		desc: "Eco-friendly packaging with handmade decorative elements",
	},
];
