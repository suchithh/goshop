import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScanner from "react-qr-barcode-scanner";
// import BottomNav from "@/components/BottomNav";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ScanBarcode = () => {
	const navigate = useNavigate();
	const [error, setError] = useState(null);

	const handleUpdate = (err, result) => {
		if (err) {
			setError(err.message);
		} else if (result) {
			navigate("/search", { state: { query: result.text } });
		}
	};

	return (
		<div className="min-h-screen px-4">
			<CollapsibleHeader title="Scan Product Barcode">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => navigate("/")}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
			</CollapsibleHeader>

			<div className="max-w-md mx-auto pt-32">
				<div className="w-full h-full p-4 relative">
					<BarcodeScanner
						onUpdate={handleUpdate}
						style={{ width: "100%", height: "100%" }}
					/>
					{error && <p className="text-red-500 mt-4 text-center">{error}</p>}
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 dark:border-gray-600 w-48 h-48"></div>
				</div>
			</div>
		</div>
	);
};

export default ScanBarcode;
