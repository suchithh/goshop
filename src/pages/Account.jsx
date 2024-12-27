import {
	SignedIn,
	SignedOut,
	SignIn,
	UserButton,
	useUser,
} from "@clerk/clerk-react";
// ...existing code...

const Account = () => {
	const { user } = useUser();

	return (
		<div className="min-h-screen p-4 bg-background text-foreground transition-colors duration-200">
			<SignedIn>
				<div className="flex flex-col items-center">
					<UserButton />
					<h2 className="text-xl font-semibold mb-4">Account Details</h2>
					{user && (
						<div className="bg-white p-4 rounded-lg shadow">
							<p>
								<strong>Name:</strong> {user.firstName} {user.lastName}
							</p>
							<p>
								<strong>Email:</strong> {user.emailAddresses[0].emailAddress}
							</p>
						</div>
					)}
				</div>
			</SignedIn>
			<SignedOut>
				<SignIn path="/sign-in" routing="path" />
			</SignedOut>
			// ...existing code...
		</div>
	);
};

export default Account;
