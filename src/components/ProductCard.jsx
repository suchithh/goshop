import React, { forwardRef } from "react";
import { Heart, Star, StarHalf, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const renderStars = (rating) => {
	const stars = [];
	const roundedRating = Math.round(rating * 2) / 2;
	for (let i = 1; i <= 5; i++) {
		if (i <= roundedRating) {
			stars.push(
				<Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
			);
		} else if (i - 0.5 === roundedRating) {
			stars.push(
				<StarHalf key={i} className="w-4 h-4 text-yellow-500 fill-current" />
			);
		} else {
			stars.push(<Star key={i} className="w-4 h-4 text-yellow-500" />);
		}
	}
	return stars;
};

const ProductCard = forwardRef(({ item, onSave, isSaved }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"rounded-xl p-4 shadow-lg transition-transform duration-200 hover:scale-[1.02]",
				"bg-white dark:bg-gray-800",
				"border border-border/50 dark:border-border-dark/50",
				"shadow-black/5 dark:shadow-black/10"
			)}
		>
			<div className="flex gap-4">
				<img
					src={item.image}
					alt={item.name}
					className="w-24 h-24 object-cover rounded-lg"
					loading="lazy"
				/>
				<div className="flex-1">
					<h3 className="font-semibold text-gray-900 dark:text-gray-100">
						{item.name}
					</h3>
					<p className="text-muted-foreground dark:text-muted-foreground-dark">
						{item.store}
					</p>
					{item.prevPrice && (
						<p className="text-sm text-gray-500 line-through">
							${item.prevPrice}
						</p>
					)}
					<p className="text-lg font-bold text-primary">${item.price}</p>
					{item.rating && item.reviews && (
						<div className="flex items-center mt-2 space-x-1">
							{renderStars(item.rating)}
							<span className="text-gray-500">({item.reviews})</span>
						</div>
					)}
				</div>
				<div className="flex flex-col items-center">
					<button onClick={() => onSave(item)} className="p-2">
						<Heart
							className={cn(
								"w-5 h-5 transition-colors",
								isSaved
									? "fill-primary stroke-primary"
									: "stroke-muted-foreground dark:stroke-muted-foreground-dark"
							)}
						/>
					</button>
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-1"
					>
						<ExternalLink className="w-5 h-5 text-blue-500 hover:underline" />
					</a>
				</div>
			</div>
		</div>
	);
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
