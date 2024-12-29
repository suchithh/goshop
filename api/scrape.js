import axios from "axios";
import { load } from "cheerio";
// import fs from "fs";

export default async function handler(req, res) {
	const { query } = req.query;

	// Validate the query parameter
	if (!query) {
		return res.status(400).json({ error: "Query parameter is required" });
	}

	try {
		// Make a request to Google Shopping
		const response = await axios.get(
			`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				},
			}
		);

		// Parse the response using Cheerio
		const html = response.data;
		// // write the code into a file
		// fs.writeFileSync("google-shopping.html", html);
		const $ = load(html);

		const items = [];
		$(".sh-dgr__grid-result").each((_, el) => {
			const name = $(el).find(".tAxDx").text().trim();
			const price = $(el).find(".a8Pemb").text().trim();
			const link = $(el).find("a.shntl").attr("href");
			const image = $(el).find(".ArOc1c img").attr("src");
			const rating = $(el).find(".Rsc7Yb").text().trim(); // Rating score
			const reviews = $(el).find(".QIrs8").text().trim(); // Reviews text

			items.push({ name, price, link, image, rating, reviews });
		});

		// Return the scraped data as a JSON response
		return res.status(200).json({ items });
	} catch (error) {
		console.error("Error scraping Google Shopping:", error.message);
		return res
			.status(500)
			.json({ error: "Failed to scrape data.", details: error.message });
	}
}
