"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DataTableLoader = ({
	columns = 5,
	rows = 5,
	withActions = true,
	enablePagination = true,
}) => {
	return (
		<div className='flex flex-col gap-4 w-full'>
			{/* Table Skeleton */}
			<div className='overflow-x-auto border border-slate-200 rounded-lg shadow-sm w-full'>
				<table className='min-w-full text-sm text-left'>
					{/* Header Skeleton */}
					<thead className='bg-purple-100 text-gray-700'>
						<tr>
							{Array.from({ length: columns }).map(
								(_, idx) => (
									<th
										key={idx}
										className='px-4 py-3 font-medium'>
										<div className='h-4 bg-gray-300 rounded w-3/4 animate-pulse'></div>
									</th>
								),
							)}
							{withActions && (
								<th className='px-4 py-3 font-medium text-center'>
									<div className='h-4 bg-gray-300 rounded w-3/4 animate-pulse mx-auto'></div>
								</th>
							)}
						</tr>
					</thead>

					{/* Body Skeleton */}
					<tbody className='divide-y divide-slate-100'>
						{Array.from({ length: rows }).map(
							(_, rowIndex) => (
								<tr
									key={rowIndex}
									className='hover:bg-slate-50'>
									{Array.from({
										length: columns,
									}).map((_, cellIndex) => (
										<td
											key={
												cellIndex
											}
											className='px-4 py-3'>
											<div className='h-4 bg-gray-200 rounded w-full animate-pulse'></div>
										</td>
									))}
									{withActions && (
										<td>
											<div className='px-4 py-3 flex gap-4 items-center justify-center'>
												<div className='h-5 w-5 bg-gray-200 rounded animate-pulse'></div>
												<div className='h-5 w-5 bg-gray-200 rounded animate-pulse'></div>
												<div className='h-5 w-5 bg-gray-200 rounded animate-pulse'></div>
											</div>
										</td>
									)}
								</tr>
							),
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Skeleton */}
			{enablePagination && (
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0'>
					{/* Rows per page selector skeleton */}
					<div className='flex items-center gap-2'>
						<div className='h-4 bg-gray-200 rounded w-20 animate-pulse'></div>
						<div className='h-8 bg-gray-200 rounded w-16 animate-pulse'></div>
					</div>

					{/* Pagination controls skeleton */}
					<div className='flex items-center gap-1'>
						<div className='p-2 text-slate-600 opacity-30'>
							<ChevronLeft className='size-5' />
						</div>

						<div className='flex items-center gap-1 mx-1'>
							{[1, 2, 3, 4, 5].map((page) => (
								<div
									key={page}
									className='min-w-8 h-8 bg-gray-200 rounded animate-pulse'></div>
							))}
						</div>

						<div className='p-2 text-slate-600 opacity-30'>
							<ChevronRight className='size-5' />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DataTableLoader;
