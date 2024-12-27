import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import ProductCard from "@/components/ProductCard";
import FilterTabs from "@/components/FilterTabs";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { faker } from "@faker-js/faker";

const generateDummyProducts = (count) => {
	return Array.from({ length: count }, () => ({
		id: faker.string.uuid(),
		name: faker.commerce.productName(),
		price: faker.commerce.price(),
		image: faker.image.url(),
		store: faker.company.name(),
	}));
};

const SearchResults = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [savedItems, setSavedItems] = useState([]);

	// Dummy results
	useEffect(() => {
		const dummyResults = generateDummyProducts(10);
		setResults(dummyResults);
	}, []);

	const toggleSaveItem = (item) => {
		setSavedItems((prev) => {
			if (prev.some((saved) => saved.id === item.id)) {
				return prev.filter((saved) => saved.id !== item.id);
			} else {
				return [...prev, item];
			}
		});
	};

	const lastElementRef = useInfiniteScroll();

	return (
		<div className="min-h-screen pb-20">
			<CollapsibleHeader
				title={`Results for "${location.state?.query}"`}
				className="mb-4"
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/")}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
			</CollapsibleHeader>

			<div className="pt-32">
				<FilterTabs />
			</div>

			<div className="max-w-2xl mx-auto px-4 pt-4">
				<div className="grid gap-4">
					{results.map((item, index) => (
						<ProductCard
							key={item.id}
							ref={index === results.length - 1 ? lastElementRef : null}
							item={item}
							onSave={toggleSaveItem}
							isSaved={savedItems.some((saved) => saved.id === item.id)}
						/>
					))}
				</div>

				{loading && (
					<div className="flex justify-center items-center h-24">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchResults;
