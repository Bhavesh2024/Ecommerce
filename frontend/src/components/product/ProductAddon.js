import React from "react";
import { motion } from "framer-motion";
const ProductAddon = ({ name, price, index }) => {
	return (
		<>
			<motion.div
				key={index}
				whileHover={{
					scale: 1.01,
				}}
				className='flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
				<div>
					<h4 className='font-medium text-gray-900'>
						{name}
					</h4>
				</div>
				<span className='font-semibold text-purple-600'>
					+₹
					{price}
				</span>
			</motion.div>
		</>
	);
};

export default ProductAddon;
