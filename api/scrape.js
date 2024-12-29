import axios from "axios";
import { load } from "cheerio";
import fs from "fs";

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
		fs.writeFileSync("google-shopping.html", html);
		const $ = load(html);

		const imageMap = {};

		// Loop through each script tag to find those with image URL and ID
		$("script").each((_, script) => {
			const scriptContent = $(script).html();

			// Match the ID and URL using a regular expression
			const match = /var\s+_u='([^']+)';\s*var\s+_i='([^']+)';/g.exec(
				scriptContent
			);

			// If a match is found, store it in the imageMap
			if (match) {
				const [_, url, id] = match;
				imageMap[id] = url.replace(/\\x3d/g, "=").replace(/\\x26/g, "&"); // Decode URL
			}
		});

		const items = [];
		$(".sh-dgr__content").each((_, el) => {
			console.log("el", el);
			const name = $(el).find(".tAxDx").text().trim();
			const price = $(el).find(".a8Pemb").text().trim();

			// Extract the link that is wrapped in Google redirect URL
			let link = $(el).find("a.shntl").attr("href");

			// Check if the link contains the URL parameter (it's the real URL)
			if (link && link.includes("/url?url=")) {
				// Extract the real URL from the `url` parameter
				const urlMatch = link.match(/url=([^&]+)/);

				if (urlMatch) {
					// Decode the URL and update the `link`
					link = decodeURIComponent(urlMatch[1]);
				}
			}

			// Map the image ID to the actual image URL from the script tags
			const imgElement = $(el).find("img");
			const imageId = imgElement.attr("id");
			const image = imageMap[imageId] || imgElement.attr("src");

			const rating = $(el).find(".Rsc7Yb").text().trim(); // Rating score if it exists

			let reviews = $(el).find(".QIrs8").text().trim(); // Reviews text
			if (reviews.includes("product reviews")) {
				// Extract the number of reviews from the text (assuming it's before 'product reviews')
				const reviewMatch = reviews.match(/(\d+)\s+product\s+reviews/);
				if (reviewMatch) {
					reviews = reviewMatch[1]; // Just the number of reviews
				}
			} else {
				reviews = "0"; // If no reviews, set to 0
			}

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
