// utils/queryClientProvider.js or lib/queryClientProvider.js
"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function QueryClientProviderWrapper({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}


export { queryClient };
