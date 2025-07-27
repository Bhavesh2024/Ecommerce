import React from "react";
export const ProductTable = ({
	data,
	columns,
	title,
	icon: Icon,
	className = "",
}) => {
	if (!data?.length) return null;

	return (
		<div
			className={`md:bg-gray-50 p-4 rounded-lg md:border md:border-gray-200 ${className}`}>
			<h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2'>
				{Icon && <Icon className='w-5 h-5 text-purple-700' />}
				{title}
			</h3>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-100'>
						<tr>
							{columns.map((col, idx) => (
								<th
									key={idx}
									className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{data.map((item, rowIdx) => (
							<tr key={rowIdx}>
								{columns.map((col, colIdx) => (
									<td
										key={colIdx}
										className={`px-3 py-2 whitespace-nowrap text-sm ${
											colIdx === 0
												? "font-medium text-gray-900"
												: "text-gray-500"
										}`}>
										{col.accessor(
											item,
											rowIdx,
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
