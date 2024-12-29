import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import {
	collection,
	getDocs,
	doc,
	deleteDoc,
	getDoc,
	updateDoc,
	arrayRemove,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import BottomNav from "@/components/BottomNav";
import { useUser } from "@clerk/clerk-react";
import ProductCard from "@/components/ProductCard";

const Cart = () => {
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState([]);
	const { user } = useUser();
	const [isFetching, setIsFetching] = useState(true);

	const encodeEmailForFirestore = (email) =>
		email.replace(/@/g, "_at_").replace(".com", "");

	useEffect(() => {
		const fetchCartItemsFromDoc = async () => {
			setIsFetching(true);
			if (!user) {
				const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
				setCartItems(localCart);
				setIsFetching(false);
				return;
			}
			const email = user.emailAddresses[0].emailAddress;
			const emailKey = encodeEmailForFirestore(email);
			const cartId = `${emailKey}_cart`;
			const usersDocRef = doc(db, "GoShop", "Users");

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
					setIsFetching(false);
				}
			} catch (error) {
				console.error("Error fetching cart items:", error);
				setIsFetching(false);
			} finally {
				setIsFetching(false);
			}
		};
		fetchCartItemsFromDoc();
	}, [user]);

	const removeItem = async (itemId) => {
		if (!user) {
			const updatedItems = cartItems.filter((item) => item.id !== itemId);
			setCartItems(updatedItems);
			localStorage.setItem("cartItems", JSON.stringify(updatedItems));
			return;
		}

		const email = user.emailAddresses[0].emailAddress;
		const emailKey = encodeEmailForFirestore(email);
		const cartId = `${emailKey}_cart`;
		const cartCollectionRef = doc(db, "GoShop", "Cart");

		try {
			const cartDoc = await getDoc(cartCollectionRef);

			if (cartDoc.exists()) {
				const cartData = cartDoc.data();

				// Check if the specific cartId exists in the "Cart" document
				if (cartData[cartId]) {
					const currentItems = cartData[cartId].items || [];

					// Remove the item from the cart
					const updatedItems = currentItems.filter(
						(item) => item.id !== itemId
					);

					await updateDoc(cartCollectionRef, {
						[`${cartId}.items`]: updatedItems,
					});

					// Update local state
					setCartItems(updatedItems);
					console.log(`Removed item with ID: ${itemId}`);
				} else {
					console.log(`Cart with ID ${cartId} does not exist.`);
				}
			} else {
				console.log("Cart document does not exist.");
			}
		} catch (error) {
			console.error("Error removing item from cart:", error);
		}
	};

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-md mx-auto pt-12">
				<h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					My Cart
				</h1>
				{isFetching ? (
					<div className="flex justify-center items-center h-24">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
					</div>
				) : cartItems.length === 0 ? (
					<p className="text-center text-gray-500 mt-8">Your cart is empty</p>
				) : (
					<div className="grid gap-4">
						{cartItems.map((item) => (
							<ProductCard
								key={item.id}
								item={item}
								onSave={() => removeItem(item.id)}
								isCart={true}
							/>
						))}
					</div>
				)}
			</div>
			<BottomNav />
		</div>
	);
};

export default Cart;
