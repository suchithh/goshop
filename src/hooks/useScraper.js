import { useState, useRef } from "react";

export const useScraper = () => {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const isFetching = useRef(false);

	const scrapeGoogleShopping = async (query) => {
		if (isFetching.current) return; // Prevent duplicate calls
		isFetching.current = true;
		setLoading(true);
		setError(null);

		try {
			const isLocalhost =
				typeof window !== "undefined" &&
				window.location.hostname === "localhost";
			const url = isLocalhost
				? "/scrape.json"
				: `/api/scrape?query=${encodeURIComponent(query)}`;

			console.log(`Scraping Google Shopping for query: ${query}`);
			console.log(`Environment: ${isLocalhost ? "Localhost" : "Production"}`);
			console.log(`Fetch URL: ${url}`);

			let response = await fetch(url);
			if (isLocalhost && response.status === 404) {
				console.log("scrape.json not found. Falling back to API call.");
				response = await fetch(
					`/api/scrape?query=${encodeURIComponent(query)}`
				);
				console.log(
					`Fallback Fetch URL: /api/scrape?query=${encodeURIComponent(query)}`
				);
				console.log(`Fallback Fetch response status: ${response.status}`);
			}

			if (!response.ok)
				throw new Error(`Failed to fetch data. Status: ${response.status}`);

			const data = await response.json();
			console.log("Raw data received:", data);

			// Process the JSON to extract only the relevant fields
			const shoppingResults =
				data.shopping_results?.map((item) => ({
					id: item.product_id,
					name: item.title,
					price: item.extracted_price,
					rating: item.rating,
					reviews: item.reviews,
					image: item.thumbnail,
					link: item.product_link,
					store: item.source,
					prevPrice: item.extracted_old_price || "",
				})) || [];

			console.log("Processed shopping results:", shoppingResults);

			setResults(shoppingResults);
		} catch (err) {
			console.error("Error in scrapeGoogleShopping:", err);
			setError(err.message);
		} finally {
			isFetching.current = false;
			setLoading(false);
		}
	};

	return { results, loading, error, scrapeGoogleShopping };
};
