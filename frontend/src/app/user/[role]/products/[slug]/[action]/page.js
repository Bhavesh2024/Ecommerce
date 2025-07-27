"use client";
import { ProductFormLoader } from "@/components/loader/FormLoader";
import { ViewProductLoader } from "@/components/loader/LayoutLoader";
import PageLoader from "@/components/loader/PageLoader";
import NotFound from "@/components/not-found/NotFound";
import { useProduct } from "@/hooks/useProduct";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React from "react";
const ProductForm = dynamic(
	() => import("@/components/form/product/ProductForm"),
	{
		ssr: true,
		loading: () => <ProductFormLoader />,
	},
);
const ViewProduct = dynamic(
	() => import("@/components/modal/view/ViewProduct"),
	{
		ssr: true,
		loading: () => <ViewProductLoader />,
	},
);
const Page = () => {
	const { role, slug, action } = useParams();
	const { data, isSuccess, isError, isLoading } = useProduct(
		true,
		slug === "new" ? null : slug,
	);
	const router = useRouter();
	const renderProductAction = (action, productData) => {
		const actionMap = {
			view: <ViewProduct data={productData} />,
			add: <ProductForm action='add' />,
			edit: (
				<ProductForm
					action='edit'
					data={productData}
				/>
			),
		};

		return actionMap[action] || <NotFound message='Invalid action' />;
	};

	return (
		<>
			{isLoading && <PageLoader />}

			{isError && action !== "add" && (
				<NotFound
					title='404'
					message='No Product Found'
				/>
			)}
			{!isLoading && action == "add" && (
				<div className='flex flex-col w-11/12 md:w-11/12 mx-auto mt-5'>
					{" "}
					<div className='border-b border-slate-300 py-1 flex justify-between items-center px-2'>
						<button
							type='button'
							onClick={() => router.back()}>
							<ArrowLeft />
						</button>
						<div className='font-semibold text-lg text-slate-800'>
							New Product
						</div>
					</div>
					{renderProductAction("add", null)}
				</div>
			)}
			{data && action !== "add" && (
				<div className='flex flex-col gap-2 mt-5 w-full md:w-11/12 mx-auto px-2'>
					<div className='border-b border-slate-300 py-1 flex justify-between items-center px-2'>
						<button
							type='button'
							onClick={() => router.back()}>
							<ArrowLeft />
						</button>
						<h1 className='font-medium text-lg text-slate-800'>
							{data?.product?.name}
						</h1>
					</div>

					{renderProductAction(action, data.product)}
				</div>
			)}
		</>
	);
};

export default Page;
