import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Home = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate("/search", { state: { query: searchQuery } });
		}
	};

	return (
		<div className="min-h-screen">
			<div className="max-w-md mx-auto pt-12 px-4">
				<h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					GoShop
				</h1>

				<div className="text-center mb-8 text-muted-foreground">
					<p>Get started by searching for a product</p>
					<p>or scan a barcode using the button below</p>
				</div>

				<form onSubmit={handleSearch} className="relative mb-6">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search for products..."
						className="w-full px-6 py-4 rounded-xl border border-border/50 
                     focus:ring-2 focus:ring-primary/20 focus:border-primary 
                     bg-white shadow-lg shadow-black/5 
                     transition-all duration-300 ease-out
                     focus:shadow-xl focus:shadow-primary/10
                     dark:bg-card"
					/>
					<button
						type="submit"
						className="absolute right-3 top-1/2 -translate-y-1/2 p-2 
                     text-muted-foreground hover:text-primary transition-colors"
					>
						<Search className="h-5 w-5" />
					</button>
				</form>
			</div>
			<BottomNav />
		</div>
	);
};

export default Home;
