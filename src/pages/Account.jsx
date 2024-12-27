import BottomNav from "@/components/BottomNav";
import {
	SignedIn,
	SignedOut,
	SignIn,
	SignInButton,
	UserButton,
	useUser,
} from "@clerk/clerk-react";

const Account = () => {
	const { user } = useUser();

	return (
		<div className="min-h-screen p-4">
			<div className="max-w-md mx-auto pt-12">
				<h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					Your Account
				</h1>
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
					Sign in to sync your saved items across devices.
					<SignInButton>Sign in</SignInButton>
				</SignedOut>
			</div>
			<BottomNav />
		</div>
	);
};

export default Account;
