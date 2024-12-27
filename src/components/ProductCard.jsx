import React, { forwardRef } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductCard = forwardRef(({ item, onSave, isSaved }, ref) => {
	return (
		<div
			ref={ref}
			className="bg-white rounded-xl p-4 shadow-lg shadow-black/5 
                 border border-border/50 
                 transition-transform duration-200 hover:scale-[1.02]"
		>
			<div className="flex gap-4">
				<img
					src={item.image}
					alt={item.name}
					className="w-24 h-24 object-cover rounded-lg"
					loading="lazy"
				/>
				<div className="flex-1">
					<h3 className="font-semibold">{item.name}</h3>
					<p className="text-muted-foreground">{item.store}</p>
					<p className="text-lg font-bold text-primary">${item.price}</p>
				</div>
				<button onClick={() => onSave(item)} className="self-start p-2">
					<Heart
						className={cn(
							"w-5 h-5 transition-colors",
							isSaved
								? "fill-primary stroke-primary"
								: "stroke-muted-foreground"
						)}
					/>
				</button>
			</div>
		</div>
	);
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
