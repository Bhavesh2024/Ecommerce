"use client";

import {
	useAdminStoreActions,
	useAdminStoreState,
} from "@/hooks/store/useAdminStore";
import { usePopupMessage } from "@/hooks/usePopupMessage";
import { useProduct } from "@/hooks/useProduct";
import ProductForm from "@/components/form/product/ProductForm";
import Header from "@/components/header/Header";
import PageLoader from "@/components/loader/PageLoader";
// import Alert from "@/components/modal/alert/Alert";
// import Modal from "@/components/modal/Modal";
// import Response from "@/components/modal/response/Response";
// import ViewProduct from "@/components/modal/view/ViewProduct";
// import DataTable from "@/components/table/DataTable";
import { handleProduct } from "@/utils/api/productApi";
import { useMutation } from "@tanstack/react-query";
import { Package, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import DataTableLoader from "@/components/loader/DataTableLoader";
import { NoItemLoader } from "@/components/loader/ItemLoader";
import { categories } from "@/utils/helper/category";
import { generateOptimizedUrl } from "@/utils/helper/generator";
const DataTable = dynamic(() => import("@/components/table/DataTable"), {
	ssr: true,
	loading: () => <DataTableLoader />,
});

const Modal = dynamic(() => import("@/components/modal/Modal"), {
	ssr: false,
});

const Response = dynamic(() => import("@/components/modal/response/Response"), {
	ssr: false,
});

const Alert = dynamic(() => import("@/components/modal/alert/Alert"), {
	ssr: false,
});

const NoItem = dynamic(() => import("@/components/not-found/NoItem"), {
	ssr: true,
	loading: () => <NoItemLoader />,
});

const page = () => {
	const { role } = useParams();
	const [openProductForm, setOpenProductForm] = useState(false);
	const [productData, setProductData] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [openView, setOpenView] = useState(false);
	const [action, setAction] = useState("add");
	const {
		data: responseProducts,
		isSuccess,
		isLoading,
		isError,
	} = useProduct(true, "all");
	const router = useRouter();
	const { products } = useAdminStoreState();
	const { addAllItem, deleteItem } = useAdminStoreActions();
	const [id, setId] = useState(null);
	const {
		message,
		isOpen,
		showError,
		showSuccess,
		type,
		closePopup,
		loading,
		startLoading,
	} = usePopupMessage();
	const { mutate: removeProductMutation } = useMutation({
		mutationFn: handleProduct,
		onSuccess: (data) => {
			deleteItem("products", id);
			showSuccess(data.message);
			setAlert(false);
			setTimeout(() => {
				closePopup();
			}, 3000);
		},
		onError: (err) => {
			setAlert(false);
			showError(err);
		},
	});
	// const handleProductForm = (action, data = null) => {
	// 	setAction(action);
	// 	setProductData(data);
	// 	setOpenProductForm(true);
	// };
	const [alert, setAlert] = useState(false);
	const [isLoadedProduct, setIsLoadedProduct] = useState(true);
	const productDataCol = [
		{
			key: "id",
			name: "#",
			render: (value, row, index) => index + 1,
		},
		{
			key: "title",
			name: "Name",
		},
		{
			key: "thumbnail",
			name: "Image",
			render: (value) => (
				<img
					src={generateOptimizedUrl(value, "w_100")}
					alt={value}
					loading='lazy'
					className='size-10 rounded-md mix-blend-multiply'
				/>
			),
		},
		{
			key: "category",
			name: "Category",
			render: (val) => categories[val] || val,
		},
		{
			key: "stockCount",
			name: "Stock",
		},
		{
			key: "stockStatus",
			name: "Stock Status",
			render: (value) => (
				<span
					className={`text-nowrap text-slate-100 text-xs p-1 px-2 w-fit rounded-full
						${value == 0 ? "bg-red-500" : "bg-emerald-500"}`}>
					{value == 0 ? "Out of stock" : "In Stock"}
				</span>
			),
		},
		{
			key: "defaultPrice",
			name: "Price (₹)",
		},
		{
			key: "description",
			name: "Description",
			render: (value) =>
				value.length > 50 ? `${value.slice(0, 50)}...` : value,
		},
		{
			key: "discount",
			name: "Discount (%)",
		},
		{
			key: "status",
			name: "Status",
			render: (value) => (
				<span
					className={`
		inline-flex items-center gap-1
		text-nowrap px-2 py-1 rounded-full text-white text-xs 
		${!value ? "bg-red-500" : "bg-emerald-500"}
	`}>
					<span
						className={`w-2 h-2 rounded-full inline-block ${
							!value ? "bg-white" : "bg-white"
						}`}></span>
					{!value ? "Deactive" : "Active"}
				</span>
			),
		},
	];

	const handleDeleteAlert = (data) => {
		const { id } = data;
		setId(id);
		setAlert(true);
	};

	const handleDelete = () => {
		setAlert(false);
		startLoading();
		removeProductMutation({
			id: id,
			method: "delete",
			type: "remove",
		});
	};
	useEffect(() => {
		if (isSuccess && responseProducts) {
			const { products } = responseProducts;
			addAllItem("products", products);
			setIsLoadedProduct(false);
			// products.map((product) => addItem(product));
		}
	}, [isSuccess, responseProducts]);

	useEffect(() => {
		if (currentProduct) {
			setOpenView(true);
		}
	}, [currentProduct]);

	useEffect(() => {
		if (!openView && currentProduct !== null) {
			setCurrentProduct(null);
		}
	}, [openView]);

	return (
		<>
			<div className='flex mx-auto w-11/12 flex-col gap-1'>
				<Header
					title='Product'
					btn={{
						name: "Add",
						icon: <Plus />,
						handler: () =>
							router.push(
								`/user/${role}/products/new/add`,
							),
					}}
				/>
				{/* Product Table*/}
				<div className='w-full'>
					{isLoading && <DataTableLoader />}
					{!isLoading &&
						isError &&
						products.length === 0 && (
							<NoItem
								message={
									"Failed to load products. Please try again."
								}
								icon={
									<Package className='size-16 text-red-500' />
								}
							/>
						)}

					{!isLoadedProduct &&
						isSuccess &&
						products &&
						products.length <= 0 && (
							<NoItem
								message={"No Products Found"}
								icon={
									<Package className='size-16 text-purple-500' />
								}
							/>
						)}
					{isSuccess && products && products.length > 0 && (
						<DataTable
							data={productDataCol}
							values={products}
							onView={(data) =>
								router.push(
									`/user/${role}/products/${data.slug}/view`,
								)
							}
							onEdit={(data) =>
								router.push(
									`/user/${role}/products/${data.slug}/edit`,
								)
							}
							onDelete={(row) =>
								handleDeleteAlert(row)
							}
						/>
					)}
				</div>
			</div>
			<Modal
				open={openProductForm}
				onClose={() => setOpenProductForm(false)}>
				<div className='min-h-36 w-full md:w-3/4 lg:w-2/3 xl:w-full rounded-md bg-white'>
					<ProductForm
						action={action}
						data={productData}
						onClose={() => setOpenProductForm(false)}
					/>
				</div>
			</Modal>
			<Modal
				open={alert}
				onClose={() => setAlert(false)}>
				<>
					<Alert
						onConfirm={handleDelete}
						onCancel={() => setAlert(false)}
						message={"Are you sure to delete product ?"}
						isOpen={alert}
						title={"Delete"}
					/>
				</>
			</Modal>
			<Modal
				open={isOpen || loading}
				onClose={closePopup}>
				{loading && <PageLoader />}
				{isOpen && (
					<Response
						message={message}
						type={type}
						onClose={closePopup}
					/>
				)}
			</Modal>
			{/* <Modal
				open={openView}
				onClose={() => setOpenView(false)}>
				<ViewProduct
					data={currentProduct}
					onClose={() => setOpenView(false)}
				/>
			</Modal> */}
		</>
	);
};

export default page;
