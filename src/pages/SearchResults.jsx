import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import ProductCard from "@/components/ProductCard";
import FilterTabs from "@/components/FilterTabs";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { faker } from "@faker-js/faker";
import { db } from "@/lib/firebase";
import {
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook
import { useScraper } from "@/hooks/useScraper";

const SearchResults = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const { user } = useUser(); // Obtain user from Clerk
	const lastElementRef = useInfiniteScroll();
	const [maxResults, setMaxResults] = useState(() => {
		return parseInt(localStorage.getItem("maxResults")) || 20;
	});
	const [filteredResults, setFilteredResults] = useState([]);
	const [filter, setFilter] = useState("Relevant");
	const { results, loading, error, scrapeGoogleShopping } = useScraper();

	const encodeEmailForFirestore = (email) =>
		email.replace(/@/g, "_at_").replace(".com", "");

	const fetchCartItems = async (currentUser) => {
		if (!currentUser) {
			const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
			setCartItems(localCart);
			return;
		}

		const email = currentUser.emailAddresses[0].emailAddress;
		const emailKey = encodeEmailForFirestore(email);
		const cartId = `${emailKey}_cart`; // Adjusted cart ID to match your schema format

		const usersDocRef = doc(db, "GoShop", "Users"); // Reference to the Users document
		try {
			const usersDoc = await getDoc(usersDocRef);

			if (usersDoc.exists()) {
				const usersData = usersDoc.data();
				// console.log(`Fetched users data: ${JSON.stringify(usersData)}`);

				// Access the nested user data
				const userData = usersData[emailKey];
				// console.log(`Fetched user data: ${JSON.stringify(userData)}`);

				if (userData && userData.cartId === cartId) {
					// Fetch the cart items from the Cart collection
					const cartDocRef = doc(db, "GoShop", "Cart");
					const cartDoc = await getDoc(cartDocRef);

					if (cartDoc.exists()) {
						setCartItems(cartDoc.data()[cartId]?.items || []); // Update state with cart items
					} else {
						console.log("Cart document does not exist.");
					}
				} else {
					console.log("User profile or cartId mismatch.");
				}
			} else {
				console.log("Users document does not exist.");
			}
		} catch (error) {
			console.error("Error fetching cart items:", error);
		}
	};

	useEffect(() => {
		if (user) {
			fetchCartItems(user);
		} else {
			setCartItems([]);
		}
	}, [user]);

	useEffect(() => {
		if (location.state?.query) {
			console.log(`Initiating scrape for query: ${location.state.query}`);
			scrapeGoogleShopping(location.state.query);
		}
	}, [location.state?.query]);

	useEffect(() => {
		const applyFilter = () => {
			let sortedResults = [...results];
			switch (filter) {
				case "Price: Low to High":
					sortedResults.sort((a, b) => a.price - b.price);
					break;
				case "Price: High to Low":
					sortedResults.sort((a, b) => b.price - a.price);
					break;
				case "Rating":
					sortedResults.sort((a, b) => b.rating - a.rating);
					break;
				default:
					break;
			}
			setFilteredResults(sortedResults.slice(0, maxResults));
		};

		applyFilter();
	}, [results, filter, maxResults]);

	useEffect(() => {
		if (error) {
			console.error("SearchResults - Error:", error);
		}
	}, [error]);

	const toggleSaveItem = async (item) => {
		if (!user) {
			let updatedItems = [...cartItems];
			const itemIndex = updatedItems.findIndex(
				(cartItem) => cartItem.id === item.id
			);
			if (itemIndex > -1) {
				updatedItems.splice(itemIndex, 1);
			} else {
				updatedItems.push(item);
			}
			setCartItems(updatedItems);
			localStorage.setItem("cartItems", JSON.stringify(updatedItems));
			return;
		}

		const email = user.emailAddresses[0].emailAddress;
		const emailKey = encodeEmailForFirestore(email);
		const cartId = `${emailKey}_cart`; // Cart ID follows the schema
		const usersDocRef = doc(db, "GoShop", "Users");

		try {
			// Fetch the Users document
			const usersDoc = await getDoc(usersDocRef);

			if (usersDoc.exists()) {
				const usersData = usersDoc.data();
				const userProfile = usersData[emailKey];

				if (userProfile && userProfile.cartId === cartId) {
					const cartDocRef = doc(db, "GoShop", "Cart");

					// Check if the item already exists in the cart
					const itemExists = cartItems.some(
						(cartItem) => cartItem.id === item.id
					);

					if (itemExists) {
						// Remove item from Firestore
						await updateDoc(cartDocRef, {
							[`${cartId}.items`]: arrayRemove(item),
						});

						// Update state
						setCartItems((prev) =>
							prev.filter((cartItem) => cartItem.id !== item.id)
						);
						console.log(`Removed item with ID: ${item.id}`);
					} else {
						// Add item to Firestore
						await updateDoc(cartDocRef, {
							[`${cartId}.items`]: arrayUnion(item),
						});

						// Update state
						setCartItems((prev) => [...prev, item]);
						console.log(`Added item with ID: ${item.id}`);
					}
				} else {
					console.error("Cart ID mismatch or user does not have a profile.");
				}
			} else {
				console.error("Users document does not exist.");
			}
		} catch (error) {
			console.error("Error toggling save item:", error);
		}
	};

	return (
		<div className="min-h-screen pb-20 bg-background text-foreground transition-colors duration-200">
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
				<FilterTabs filter={filter} setFilter={setFilter} />
			</div>

			<div className="max-w-2xl mx-auto px-4 pt-4">
				<div className="grid gap-4">
					{filteredResults.map((item, index) => (
						<ProductCard
							key={index}
							ref={index === filteredResults.length - 1 ? lastElementRef : null}
							item={item}
							onSave={toggleSaveItem}
							isSaved={cartItems.some((cartItem) => cartItem.id === item.id)}
							isCart={false}
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
