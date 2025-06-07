// store/useAdminStore.js
import { create } from "zustand";

const useAdminStore = create((set) => ({
	// Predefined entities
	products: [],
	users: [],
	orders: [],
	inventory: [],
	user: null,

	// Add a new item to an entity
	addItem: (key, newItem) =>
		set((state) => ({
			[key]: [...state[key], newItem],
		})),
	addAllItem: (key, items) => set(() => ({ [key]: items })),
	// Update an item in an entity
	updateItem: (key, updatedItem) =>
		set((state) => ({
			[key]: state[key].map((item) =>
				item.id === updatedItem.id ? updatedItem : item,
			),
		})),

	// Delete an item from an entity
	deleteItem: (key, itemId) =>
		set((state) => ({
			[key]: state[key].filter((item) => item.id !== itemId),
		})),

	// Reset all items of a specific entity
	resetItems: (key) =>
		set((state) => ({
			[key]: [],
		})),
	setValue: (key, value) => set({ [key]: value }),
	clearValue: (key) =>
		set({ [key]: Array.isArray(initialState[key]) ? [] : null }),
}));

export const useAdminStoreActions = () => {
	const addItem = useAdminStore((state) => state.addItem);
	const addAllItem = useAdminStore((state) => state.addAllItem);
	const updateItem = useAdminStore((state) => state.updateItem);
	const deleteItem = useAdminStore((state) => state.deleteItem);
	const resetItems = useAdminStore((state) => state.resetItems);
	const setValue = useAdminStore((state) => state.setValue);
	const clearValue = useAdminStore((state) => state.clearValue);

	return {
		addItem,
		updateItem,
		deleteItem,
		resetItems,
		addAllItem,
		setValue,
		clearValue,
	};
};

export const useAdminStoreState = () => {
	const products = useAdminStore((state) => state.products);
	const users = useAdminStore((state) => state.users);
	const orders = useAdminStore((state) => state.orders);
	const inventory = useAdminStore((state) => state.inventory);
	const user = useAdminStore((state) => state.user);

	return { products, users, orders, inventory, user };
};
