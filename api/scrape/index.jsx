import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
	const { query } = req.query; // Query term passed from the frontend
	if (!query) {
		return res.status(400).json({ error: "Query parameter is required" });
	}

	try {
		// Example scraping logic (replace with actual Google Shopping scraping)
		const response = await axios.get(
			`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`,
			{
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				},
			}
		);

		const html = response.data;
		const $ = cheerio.load(html);

		const items = [];
		$(".sh-dgr__grid-result").each((_, el) => {
			const name = $(el).find(".sh-np__product-title").text().trim();
			const price = $(el).find(".T14wmb").text().trim();
			const link = $(el).find("a.shntl").attr("href");
			const image = $(el).find("img.sh-dgr__image").attr("src");

			items.push({ name, price, link, image });
		});

		return res.status(200).json({ items });
	} catch (error) {
		console.error("Error scraping Google Shopping:", error.message);
		return res.status(500).json({ error: "Failed to scrape data." });
	}
}
