import BottomNav from "@/components/BottomNav";
import {
	SignedIn,
	SignedOut,
	SignIn,
	useUser,
	useClerk,
} from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, updateDoc } from "firebase/firestore";

// Add the custom SignOutButton component
export const SignOutButton = () => {
	const { signOut } = useClerk();

	return (
		// Clicking this button signs out a user
		// and redirects them to the account page "/account".
		<button
			onClick={() => signOut({ redirectUrl: "/account" })}
			className="mt-4 px-6 py-2 bg-secondary rounded-md hover:bg-secondary-dark transition"
		>
			Sign out
		</button>
	);
};

const Account = () => {
	const { user } = useUser();
	const [isSignInOpen, setIsSignInOpen] = useState(false);

	// Helper function to encode the email for Firestore
	const encodeEmailForFirestore = (email) =>
		email.replace(/@/g, "_at_").replace(".com", "");

	useEffect(() => {
		const pushUserToFirebase = async () => {
			if (user) {
				const email = user.emailAddresses[0].emailAddress;
				const emailKey = encodeEmailForFirestore(email);
				const cartId = `${emailKey}_cart`;

				// Reference to the Users document
				const usersDocRef = doc(db, "GoShop", "Users");

				// Get the Users document
				const usersDoc = await getDoc(usersDocRef);

				let usersData = usersDoc.exists() ? usersDoc.data() : {};

				// Check if the user already exists in the map field
				if (!usersData[emailKey]) {
					// Update the Users document to include the user's profile
					await updateDoc(usersDocRef, {
						[emailKey]: {
							profile: {
								firstName: user.firstName || "",
								lastName: user.lastName || "",
								email: email,
								createdAt: new Date().toISOString(),
							},
							cartId: cartId,
						},
					});

					// Create a new document in the Cart collection for the user's cart
					const cartDocRef = doc(db, "GoShop", "Cart");
					if (!usersData[cartId]) {
						try {
							await updateDoc(cartDocRef, {
								[cartId]: { items: [], createdAt: new Date().toISOString() },
							});
						} catch (err) {
							console.log(err);
						}
					}
				}
			}
		};

		pushUserToFirebase();
	}, [user]);

	return (
		<div className="min-h-screen flex flex-col p-4 relative">
			<div className="max-w-md mx-auto pt-12 flex-grow">
				<h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					Your Account
				</h1>
				<SignedIn>
					<div className="flex flex-col items-center">
						<h2 className="text-xl font-semibold mb-4">Account Details</h2>
						{user && (
							<div className="bg-white bg-opacity-50 dark:bg-gray-700 p-6 rounded-lg shadow flex flex-col items-center">
								<p className="text-center text-gray-800 dark:text-gray-200">
									<strong>User Name:</strong> {user.firstName} {user.lastName}
								</p>
								<p className="text-center text-gray-800 dark:text-gray-200">
									<strong>Email:</strong> {user.emailAddresses[0].emailAddress}
								</p>
								<SignOutButton />
							</div>
						)}
					</div>
				</SignedIn>
				<SignedOut>
					<div className="flex flex-col items-center bg-white bg-opacity-50 p-6 rounded-xl shadow-md dark:bg-gray-800">
						<p className="mb-4 text-center text-gray-700 dark:text-gray-300">
							Sign in to sync your saved items across devices.
						</p>
						<button
							onClick={() => setIsSignInOpen(true)}
							className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
						>
							Sign in
						</button>
					</div>
					{isSignInOpen && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
							<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
								<button
									onClick={() => setIsSignInOpen(false)}
									className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-500"
								>
									&times;
								</button>
								<SignIn forceRedirectUrl="/account" />
							</div>
						</div>
					)}
				</SignedOut>
			</div>
			<BottomNav />
		</div>
	);
};

export default Account;
