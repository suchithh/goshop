import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import BottomNav from "@/components/BottomNav";

const Cart = () => {
	const navigate = useNavigate();
	const [savedItems, setSavedItems] = useState([]);

	useEffect(() => {
		const items = localStorage.getItem("savedItems");
		if (items) {
			setSavedItems(JSON.parse(items));
		}
	}, []);

	const removeItem = (itemId) => {
		const newItems = savedItems.filter((item) => item.id !== itemId);
		setSavedItems(newItems);
		localStorage.setItem("savedItems", JSON.stringify(newItems));
	};

	return (
		<div className="min-h-screen p-4 ">
			<button
				onClick={() => navigate("/")}
				className="mb-4 flex items-center gap-2"
			>
				<ArrowLeftIcon className="w-5 h-5" />
				Back
			</button>

			<h2 className="text-xl font-semibold mb-4">Saved Items</h2>

			{savedItems.length === 0 ? (
				<p className="text-center text-gray-500 mt-8">No saved items yet</p>
			) : (
				<div className="grid gap-4">
					{savedItems.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
						>
							<div>
								<h3 className="font-semibold">{item.name}</h3>
								<p className="text-sm text-gray-500">{item.store}</p>
								<p className="font-bold text-gray-700">${item.price}</p>
							</div>
							<button
								onClick={() => removeItem(item.id)}
								className="text-red-500 hover:text-red-700 flex items-center gap-1"
							>
								<TrashIcon className="w-5 h-5" />
								Remove
							</button>
						</div>
					))}
				</div>
			)}
			<BottomNav />
		</div>
	);
};

export default Cart;
