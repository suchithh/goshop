import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import ThemeToggle from "./components/ThemeToggle";
import ScanBarcode from "./pages/ScanBarcode";
import Settings from "./pages/Settings";
import Account from "./pages/Account";

function App() {
	// Handle Clerk handshake parameter
	const location = useLocation();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		if (urlParams.has("__clerk_handshake")) {
			// Remove handshake query parameter and redirect to a valid route
			window.history.replaceState({}, document.title, location.pathname);
		}
	}, [location]);

	return (
		<Router>
			<ThemeToggle />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/scan" element={<ScanBarcode />} />
				<Route path="/search" element={<SearchResults />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/account" element={<Account />} />
				{/* Catch-all route */}
				<Route path="*" element={<Navigate to="/account" />} />
			</Routes>
		</Router>
	);
}

export default App;
