import SerpApi from "google-search-results-nodejs";

export default async function handler(req, res) {
	try {
		console.log("Request received with query:", req.query);

		const { query } = req.query;

		if (!query) {
			console.error("Missing query parameter");
			return res.status(400).json({ error: "Query parameter is required." });
		}

		console.log("Initializing SerpApi...");
		const serpApi = new SerpApi.GoogleSearch();

		const params = {
			api_key:
				"934b6b3e219edbd03d85a537b4b38f929bb7f9daf7c97eab9f7f57cba54715bf",
			q: query,
			location: "United States",
			tbm: "shop",
		};

		console.log("Fetching results with params:", params);

		// Convert the callback into a promise
		const fetchResults = () =>
			new Promise((resolve, reject) => {
				serpApi.json(params, (error, data) => {
					if (error) {
						console.error("Error fetching results from SerpApi:", error);
						return reject(error);
					}
					resolve(data);
				});
			});

		// Wait for the SerpApi results
		const data = await fetchResults();

		// Log the data received
		console.log("Results received from SerpApi:", data);

		// Return the data as JSON to the client
		return res.status(200).json(data);
	} catch (error) {
		console.error("Unhandled error:", error);
		return res.status(500).json({ error: error.message });
	}
}
