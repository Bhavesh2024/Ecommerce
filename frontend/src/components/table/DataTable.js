import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const DataTable = ({
	data,
	values,
	rowsPerPage = 5,
	enablePagination = true,
	onView = null,
	onEdit = null,
	onDelete = null,
}) => {
	// Validation
	const isArrayData = Array.isArray(data);
	const isArrayValues = Array.isArray(values);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(
		isArrayValues ? values.length / rowsPerPage : 1,
	);

	const visibleValues = enablePagination
		? values.slice(
				(currentPage - 1) * rowsPerPage,
				currentPage * rowsPerPage,
		  )
		: values;

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	if (!isArrayData)
		return (
			<div className='text-red-500 text-xs'>
				Invalid Data Format
			</div>
		);
	if (!isArrayValues)
		return (
			<div className='text-red-500 text-xs'>
				Value Must Be Array of Objects
			</div>
		);

	return (
		<div className='flex flex-col gap-1 w-full'>
			<div className='overflow-x-auto border border-slate-200 rounded-lg shadow-sm w-full'>
				<table className='min-w-full text-sm text-left'>
					<thead className='bg-gray-100 text-gray-700'>
						<tr>
							{data.map(({ name, key }, idx) => (
								<th
									key={idx}
									className='px-4 py-2 font-semibold text-nowrap'>
									{name}
								</th>
							))}

							{(onView || onEdit || onDelete) && (
								<th className='px-4 py-2 font-semibold text-center'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody>
						{visibleValues.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className='hover:bg-gray-50'>
								{data.map(
									(
										{ key, render },
										cellIndex,
									) => (
										<td
											key={
												cellIndex
											}
											className='px-4 py-2 text-nowrap'>
											{render
												? render(
														row[
															key
														],
														row,
														rowIndex,
												  )
												: row[
														key
												  ]}
										</td>
									),
								)}
								{(onView ||
									onEdit ||
									onDelete) && (
									<td className=''>
										<div className='px-4 py-2 flex gap-4 items-center justify-center'>
											{onView && (
												<Eye
													className='size-5 text-blue-500 cursor-pointer my-auto'
													onClick={() =>
														onView?.(
															row,
														)
													}
												/>
											)}
											{onEdit && (
												<Pencil
													className='size-5 text-green-500 cursor-pointer my-auto'
													onClick={() =>
														onEdit?.(
															row,
														)
													}
												/>
											)}
											{onDelete && (
												<Trash2
													className='size-5 text-red-500 cursor-pointer my-auto'
													onClick={() =>
														onDelete?.(
															row,
														)
													}
												/>
											)}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			{enablePagination && (
				<div className='flex justify-between items-center px-4 py-2'>
					<span className='text-xs text-gray-500'>
						Page {currentPage} of {totalPages}
					</span>
					<div className='space-x-2'>
						<button
							onClick={() =>
								goToPage(currentPage - 1)
							}
							disabled={currentPage === 1}
							className='text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50'>
							Prev
						</button>
						{Array.from(
							{ length: totalPages },
							(_, i) => i + 1,
						).map((page) => (
							<button
								key={page}
								onClick={() => goToPage(page)}
								className={`text-xs px-2 py-1 rounded ${
									page === currentPage
										? "bg-blue-500 text-white"
										: "bg-gray-200 hover:bg-gray-300"
								}`}>
								{page}
							</button>
						))}
						<button
							onClick={() =>
								goToPage(currentPage + 1)
							}
							disabled={currentPage === totalPages}
							className='text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50'>
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DataTable;
