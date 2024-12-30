import React from "react";
import { Button } from "./ui/button";

const FilterTabs = ({ filter, setFilter }) => {
	const filters = [
		"Relevant",
		"Price: Low to High",
		"Price: High to Low",
		"Rating",
	];

	return (
		<div className="overflow-x-auto py-2 px-4 border-b border-border/50 bg-background/80 backdrop-blur-lg">
			<div className="flex gap-2 min-w-max">
				{filters.map((filterOption) => (
					<Button
						key={filterOption}
						variant={filter === filterOption ? "solid" : "outline"}
						size="sm"
						className={`rounded-full ${
							filter === filterOption
								? "bg-primary text-white"
								: "bg-white text-black"
						}`}
						onClick={() => setFilter(filterOption)}
					>
						{filterOption}
					</Button>
				))}
			</div>
		</div>
	);
};

export default FilterTabs;
