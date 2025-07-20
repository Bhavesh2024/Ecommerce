import { create } from "zustand";

const initialState = {
	user: null,
	orders: [],
	notFound: false,
};

const useCustomerStore = create((set) => ({
	...initialState,
	addItem: (key, newItem) =>
		set((state) => ({
			[key]: [...(state[key] || []), newItem],
		})),
	addAllItems: (key, items) =>
		set(() => ({
			[key]: items,
		})),
	updateItem: (key, updatedItem) =>
		set((state) => ({
			[key]: (state[key] || []).map((item) =>
				item.id === updatedItem.id ? updatedItem : item,
			),
		})),
	deleteItem: (key, itemId) =>
		set((state) => ({
			[key]: (state[key] || []).filter(
				(item) => item.id !== itemId,
			),
		})),
	resetItems: (key) =>
		set(() => ({
			[key]: Array.isArray(initialState[key]) ? [] : null,
		})),

	setValue: (key, value) => set({ [key]: value }),
	clearValue: (key) =>
		set({ [key]: Array.isArray(initialState[key]) ? [] : null }),
}));

export const useCustomerStoreActions = () => {
	const addItem = useCustomerStore((state) => state.addItem);
	const addAllItems = useCustomerStore((state) => state.addAllItems);
	const updateItem = useCustomerStore((state) => state.updateItem);
	const deleteItem = useCustomerStore((state) => state.deleteItem);
	const resetItems = useCustomerStore((state) => state.resetItems);
	const setValue = useCustomerStore((state) => state.setValue);
	const clearValue = useCustomerStore((state) => state.clearValue);

	return {
		addItem,
		addAllItems,
		updateItem,
		deleteItem,
		resetItems,
		setValue,
		clearValue,
	};
};

export const useCustomerStoreState = () => {
	const user = useCustomerStore((state) => state.user);
	const orders = useCustomerStore((state) => state.orders);
	const notFound = useCustomerStore((state) => state.notFound);
	return { user, orders, notFound };
};

export default useCustomerStore;
