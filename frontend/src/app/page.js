import Navbar from "@/layout/navbar/Navbar";
import { products } from "@/utils/product";
import ProductCard from "@/components/card/ProductCard";
import "./globals.css";

export default function Home() {
	return (
		<>
			<Navbar />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
				{products.map((product) => (
					<ProductCard key={product.title} product={product} />
				))}
			</div>
		</>
	);
}
