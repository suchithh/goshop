import fetch from "node-fetch";
//dotenv
import dotenv from "dotenv";
import fs from "fs";
const envPath = "./.env.local";
if (fs.existsSync(envPath)) {
	dotenv.config({ path: envPath });
} else {
	console.warn(`Environment file ${envPath} not found.`);
}

export default async function handler(req, res) {
	try {
		console.log("Request received with query:", req.query);

		const { query } = req.query;

		if (!query) {
			console.error("Missing query parameter");
			return res.status(400).json({ error: "Query parameter is required." });
		}

		const params = {
			api_key: process.env.SERP_API_KEY,
			q: query,
			location: "United States",
			tbm: "shop",
		};

		// console.log("Fetching results with params:", params);
		console.log("Fetching results with query:", query);

		const requestUrl =
			"https://serpapi.com/search.json?" +
			new URLSearchParams(params).toString();
		const response = await fetch(requestUrl);
		const data = await response.json();

		// Log the data received
		// console.log("Results received from SerpApi:", data);

		// Set response header
		res.setHeader("Content-Type", "application/json");

		// Return the data as JSON to the client
		return res.status(200).json(data);
	} catch (error) {
		console.error("Unhandled error:", error);
		return res.status(500).json({ error: error.message });
	}
}
