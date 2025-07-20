import React from "react";
import { Gem, Brush, Shirt, Droplets, Gift, Leaf } from "lucide-react";
import { collectionIcons } from "@/utils/helper/web-content";
import dynamic from "next/dynamic";
import { CollectionCardLoader } from "../loader/CardLoader";
const CollectionCard = dynamic(() => import("../card/CollectionCard"), {
	loading: () => <CollectionCardLoader />,
	ssr: false,
});
const Collection = () => {
	return (
		<>
			<section className='py-12 px-6 max-w-6xl mx-auto'>
				<h2 className='text-2xl font-semibold text-gray-800 mb-2 text-center'>
					Our Handmade Collections
				</h2>
				<p className='text-gray-500 text-center mb-8 max-w-2xl mx-auto'>
					Carefully crafted using traditional techniques and
					sustainable materials
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					{collectionIcons.map(
						({ name, icon, desc }, index) => (
							<CollectionCard
								name={name}
								Icon={icon}
								desc={desc}
								index={index}
							/>
						),
					)}
				</div>
			</section>
		</>
	);
};

export default Collection;
