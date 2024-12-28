import { useState } from "react";

export const useScraper = () => {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const scrapeGoogleShopping = async (query) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`/api/scrape?query=${encodeURIComponent(query)}`
			);
			if (!response.ok) throw new Error("Failed to fetch data.");
			const data = await response.json();
			setResults(data.items || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return { results, loading, error, scrapeGoogleShopping };
};
