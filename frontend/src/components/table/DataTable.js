"use client";
import React, { useState, useRef, useEffect } from "react";
import { Edit, Eye, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const DataTable = ({
	data,
	values,
	enablePagination = true,
	onView = null,
	onEdit = null,
	onDelete = null,
	rowsPerPage = [5, 10, 20, 50, 100],
}) => {
	// Validation
	const isArrayData = Array.isArray(data);
	const isArrayValues = Array.isArray(values);
	const [rows, setRows] = useState(
		Array.isArray(rowsPerPage) &&
			rowsPerPage.some((rowNum) => isNaN(rowNum))
			? [5, 10, 20, 50, 100]
			: rowsPerPage,
	);
	const [selectedRows, setSelectedRows] = useState(rows[0]);
	const paginationRef = useRef(null);
	const [maxVisiblePages, setMaxVisiblePages] = useState(5);

	// Calculate responsive max visible pages
	useEffect(() => {
		const updateMaxVisiblePages = () => {
			if (!paginationRef.current) return;
			const containerWidth = paginationRef.current.offsetWidth;
			// Approximate calculation based on button width (40px) + margin
			const calculatedMax = Math.max(
				1,
				Math.floor(containerWidth / 44) - 2,
			);
			setMaxVisiblePages(calculatedMax);
		};

		updateMaxVisiblePages();
		const resizeObserver = new ResizeObserver(updateMaxVisiblePages);
		if (paginationRef.current) {
			resizeObserver.observe(paginationRef.current);
		}

		return () => resizeObserver.disconnect();
	}, []);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(
		isArrayValues ? values.length / selectedRows : 1,
	);

	const visibleValues = enablePagination
		? values.slice(
				(currentPage - 1) * selectedRows,
				currentPage * selectedRows,
		  )
		: values;

	const goToPage = (page) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	// Generate optimized page numbers with dynamic ellipsis
	const getPageNumbers = () => {
		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const pages = [];
		const leftBound = Math.max(
			2,
			currentPage - Math.floor(maxVisiblePages / 3),
		);
		const rightBound = Math.min(
			totalPages - 1,
			currentPage + Math.floor(maxVisiblePages / 3),
		);

		// Always show first page
		pages.push(1);

		// Add left ellipsis if needed
		if (leftBound > 2) {
			pages.push("...");
		}

		// Add middle pages
		for (let i = leftBound; i <= rightBound; i++) {
			pages.push(i);
		}

		// Add right ellipsis if needed
		if (rightBound < totalPages - 1) {
			pages.push("...");
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
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
		<div className='flex flex-col gap-4 w-full'>
			<div className='overflow-x-auto border border-slate-200 rounded-lg shadow-sm w-full'>
				<table className='min-w-full text-sm text-left'>
					<thead className='bg-purple-100 text-gray-700'>
						<tr>
							{data.map(({ name, key }, idx) => (
								<th
									key={idx}
									className='px-4 py-3 font-medium text-nowrap'>
									{name}
								</th>
							))}

							{(onView || onEdit || onDelete) && (
								<th className='px-4 py-3 font-medium text-center'>
									Actions
								</th>
							)}
						</tr>
					</thead>
					<tbody className='divide-y divide-slate-100'>
						{visibleValues.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className='hover:bg-slate-50'>
								{data.map(
									(
										{ key, render },
										cellIndex,
									) => (
										<td
											key={
												cellIndex
											}
											className='px-4 py-3 text-nowrap'>
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
										<div className='px-4 py-3 flex gap-4 items-center justify-center'>
											{onView && (
												<button
													onClick={() =>
														onView?.(
															row,
														)
													}
													className='text-purple-500 hover:text-purple-700 transition-colors'
													aria-label='View'>
													<Eye className='size-5' />
												</button>
											)}
											{onEdit && (
												<button
													onClick={() =>
														onEdit?.(
															row,
														)
													}
													className='text-green-500 hover:text-green-700 transition-colors'
													aria-label='Edit'>
													<Edit className='size-5' />
												</button>
											)}
											{onDelete && (
												<button
													onClick={() =>
														onDelete?.(
															row,
														)
													}
													className='text-red-500 hover:text-red-700 transition-colors'
													aria-label='Delete'>
													<Trash2 className='size-5' />
												</button>
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
			{enablePagination && totalPages > 1 && (
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0'>
					{/* Rows per page selector */}
					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-600'>
							Rows per page:
						</span>
						<select
							className='border border-slate-300 h-8 w-16 pl-2 pr-1 rounded text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-500'
							value={selectedRows}
							onChange={(e) => {
								setSelectedRows(
									Number(e.target.value),
								);
								setCurrentPage(1);
							}}>
							{rows.map((num) => (
								<option
									key={num}
									value={num}>
									{num}
								</option>
							))}
						</select>
					</div>

					{/* Smart pagination */}
					<div
						ref={paginationRef}
						className='flex items-center gap-1 overflow-hidden'>
						<button
							onClick={() =>
								goToPage(currentPage - 1)
							}
							disabled={currentPage === 1}
							className='p-2 text-slate-600 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed'
							aria-label='Previous page'>
							<ChevronLeft className='size-5' />
						</button>

						<div className='flex items-center gap-1 mx-1 overflow-x-auto scrollbar-hide'>
							{getPageNumbers().map((page, index) =>
								page === "..." ? (
									<button
										key={`ellipsis-${index}`}
										disabled
										className='px-3 py-1 text-slate-600 cursor-default'>
										...
									</button>
								) : (
									<button
										key={page}
										onClick={() =>
											goToPage(page)
										}
										className={`min-w-8 h-8 px-2 rounded text-sm flex items-center justify-center ${
											page ===
											currentPage
												? "bg-purple-600 text-white"
												: "text-slate-600 hover:bg-slate-100"
										}`}>
										{page}
									</button>
								),
							)}
						</div>

						<button
							onClick={() =>
								goToPage(currentPage + 1)
							}
							disabled={currentPage === totalPages}
							className='p-2 text-slate-600 hover:text-purple-700 disabled:opacity-30 disabled:cursor-not-allowed'
							aria-label='Next page'>
							<ChevronRight className='size-5' />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default DataTable;
