"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
	queryClient,
	QueryClientProviderWrapper,
} from "@/config/queryClientProvider";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { FooterLoader } from "@/components/loader/LayoutLoader";
import { Analytics } from "@vercel/analytics/next";
const Footer = dynamic(() => import("@/layout/footer/Footer"), {
	loading: () => <FooterLoader />,
	ssr: false,
});
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function RootLayout({ children }) {
	const path = usePathname();
	const hideFooterLocations = [
		"/user/admin",
		"/user/customer/auth",
		"checkout",
		"profile",
		"my-orders",
	];
	const hideFooter = hideFooterLocations.some(
		(route) => path.startsWith(route) || path.endsWith(route),
	);
	return (
		<html lang='en'>
			<head>
				<link
					href='https://fonts.googleapis.com/css2?family=Pacifico&display=swap'
					rel='stylesheet'
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-purple-50`}>
				<QueryClientProviderWrapper client={queryClient}>
					{children}
				</QueryClientProviderWrapper>
				<Analytics />
				{/* Show Footer only when needed */}
				{!hideFooter && <Footer />}
			</body>
		</html>
	);
}
