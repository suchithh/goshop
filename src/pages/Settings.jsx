import React, { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
// import { useTheme } from "@/hooks/useTheme";
import { Sliders, ShoppingCart, Github, CodeXml } from "lucide-react";

const Settings = () => {
	const [maxResults, setMaxResults] = useState(() => {
		return parseInt(localStorage.getItem("maxResults")) || 20;
	});

	useEffect(() => {
		localStorage.setItem("maxResults", maxResults);
	}, [maxResults]);

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-md mx-auto pt-12">
				<h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					Settings
				</h1>
				<div className="bg-white bg-opacity-50 p-6 rounded-xl shadow-md dark:shadow-lg">
					<div className="mb-4 flex items-center">
						<Sliders className="mr-2" />
						<h2 className="text-xl font-semibold">Maximum Results</h2>
						<input
							type="number"
							min="1"
							max="100"
							value={maxResults}
							onChange={(e) => setMaxResults(parseInt(e.target.value))}
							className="mt-2 px-4 py-2 border rounded-md ml-auto 
									   bg-white dark:bg-gray-700 
									   text-black dark:text-white 
									   placeholder-gray-500 dark:placeholder-gray-400 
									   focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div className="mb-4 flex items-center">
						<ShoppingCart className="mr-2" />
						<h2 className="text-xl font-semibold">App Version</h2>
						<p className="mt-2 ml-auto">Version 1.0.0</p>
					</div>
					<div className="mb-4 flex items-center">
						<CodeXml className="mr-2" />
						<h2 className="text-xl font-semibold">Source Code</h2>
						<a
							href="https://github.com/suchithh/goshop"
							target="_blank"
							rel="noreferrer"
							className="mt-2 ml-auto text-primary flex items-center"
						>
							<Github className="mr-1" />
							GitHub
						</a>
					</div>
				</div>
			</div>
			<BottomNav />
		</div>
	);
};

export default Settings;
