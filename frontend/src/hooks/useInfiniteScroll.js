import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
	containerRef,
	loadMore,
	threshold = 200,
}) => {
	const observerRef = useRef();

	useEffect(() => {
		const options = {
			root: containerRef.current,
			rootMargin: `${threshold}px`,
			threshold: 0.1,
		};

		observerRef.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadMore();
			}
		}, options);

		if (containerRef.current) {
			observerRef.current.observe(containerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [loadMore, threshold, containerRef]);
};
