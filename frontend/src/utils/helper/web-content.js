import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { Gem, Brush, Shirt, Droplets, Gift, Leaf } from "lucide-react";
export const phoneNumbers = [
	{
		countryCode: "+91",
		phone: "7041656237",
		icon: Phone,
		link: "tel:7041656237",
	},
	{
		countryCode: "+91",
		phone: "9106324452",
		icon: Phone,
		link: "tel:9106324452",
	},
];

export const emailAddress = {
	link: "mailto:upsquareart@gmail.com",
	icon: Mail,
	email: "upsquareart@gmail.com",
};

export const location = {
	link: "https://maps.app.goo.gl/S4AN8cdNGkoi7QT2A",
	icon: MapPin,
	address: "C3 Compartment, Upsquare Art",
};

export const workHours = {
	weekdays: "Mon - Sat: 10:00 AM - 8:00 PM",
};
export const socialMedia = [
	{
		name: "Facebook",
		link: "https://www.facebook.com/share/15tBWUgRT4/",
		icon: FaFacebook,
	},
	{
		name: "Instagram",
		link: "https://www.instagram.com/upsquare_art?igsh=MWVqeWwwdHJrd2ZudQ==",
		icon: FaInstagram,
	},
	// {
	// 	name: "WhatsApp",
	// 	link: "https://wa.me/7041656237",
	// 	icon: FaWhatsapp,
	// },
];

export const logoImageUrl = "/images/logo/upsquare-art.png";
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
		desc: "Unique jewellery featuring hand-engraved wooden and metal elements",
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
