import React from "react";
import { Button } from "./ui/button";

const FilterTabs = () => {
	return (
		<div className="overflow-x-auto py-2 px-4 border-b border-border/50 bg-background/80 backdrop-blur-lg">
			<div className="flex gap-2 min-w-max">
				<Button variant="outline" size="sm" className="rounded-full">
					All
				</Button>
				<Button variant="outline" size="sm" className="rounded-full">
					Price: Low to High
				</Button>
				<Button variant="outline" size="sm" className="rounded-full">
					Price: High to Low
				</Button>
				<Button variant="outline" size="sm" className="rounded-full">
					Rating
				</Button>
				<Button variant="outline" size="sm" className="rounded-full">
					Distance
				</Button>
			</div>
		</div>
	);
};

export default FilterTabs;
