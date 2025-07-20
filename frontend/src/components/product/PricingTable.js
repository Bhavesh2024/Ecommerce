"use client";
import React from "react";
import { motion } from "framer-motion";
const PricingTable = ({ index, discount, type, variants }) => {
	return (
		<>
			<div
				key={index}
				className='mb-8'>
				<h3 className='text-lg font-semibold text-gray-900 mb-4'>
					{type}
				</h3>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Variant
							</th>
							<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Price
							</th>
							{discount > 0 && (
								<>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Discount
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
										You Pay
									</th>
								</>
							)}
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{variants.map((variant, idx) => {
							const discountAmount = Math.round(
								(variant.value * discount) /
									100,
							);
							const finalPrice =
								variant.value - discountAmount;

							return (
								<motion.tr
									key={idx}
									whileHover={{
										backgroundColor:
											"#f9fafb",
									}}
									className='transition-colors'>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										{variant.label}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
										₹{variant.value}
									</td>
									{discount > 0 && (
										<>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right'>
												-₹
												{
													discountAmount
												}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600 text-right'>
												₹
												{
													finalPrice
												}
											</td>
										</>
									)}
								</motion.tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default PricingTable;
