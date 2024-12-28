import React, { useState } from "react";
import { useScraper } from "../hooks/useScraper";

const Test = () => {
	const [query, setQuery] = useState("");
	const { results, loading, error, scrapeGoogleShopping } = useScraper();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (query.trim()) {
			scrapeGoogleShopping(query.trim());
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Google Shopping Scraper</h1>
			<form onSubmit={handleSubmit} className="mb-4">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Enter search query"
					className="w-full p-2 border border-gray-300 rounded mb-2"
				/>
				<button
					type="submit"
					className="w-full p-2 bg-blue-500 text-white rounded"
				>
					Search
				</button>
			</form>

			{loading && <p>Loading...</p>}
			{error && <p className="text-red-500">Error: {error}</p>}

			<div>
				{results.length > 0 && (
					<ul className="space-y-4">
						{results.map((item) => (
							<li key={item.link} className="flex items-center space-x-4">
								<img
									src={item.image}
									alt={item.name}
									className="w-16 h-16 object-cover"
								/>
								<div>
									<h2 className="text-lg font-semibold">{item.name}</h2>
									<p className="text-gray-600">{item.price}</p>
									<a
										href={item.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500"
									>
										View Product
									</a>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Test;
