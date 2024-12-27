import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import ThemeToggle from "./components/ThemeToggle";
import ScanBarcode from "./pages/ScanBarcode";

function App() {
	return (
		<Router>
			<ThemeToggle />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/scan" element={<ScanBarcode />} />
				<Route path="/search" element={<SearchResults />} />
				<Route path="/cart" element={<Cart />} />
			</Routes>
		</Router>
	);
}

export default App;
