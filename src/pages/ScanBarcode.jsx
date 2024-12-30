import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZxing } from "react-zxing";
import BottomNav from "@/components/BottomNav";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ScanBarcode = () => {
	const navigate = useNavigate();
	const [error, setError] = useState(null);
	const [result, setResult] = useState("");

	const { ref } = useZxing({
		onDecodeResult(result) {
			setResult(result.getText());
			console.log("Barcode Scanned:", result.getText());
			navigate("/search", { state: { query: result.getText() } });
		},
		onError(err) {
			console.error("Scanning failed:", err);
			setError("Unable to scan. Please try again.");
		},
	});

	const handleBackClick = () => {
		navigate("/");
	};

	return (
		<div className="min-h-screen px-4">
			<CollapsibleHeader title="Scan Product Barcode">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleBackClick}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
			</CollapsibleHeader>

			<div className="max-w-md mx-auto pt-32">
				<div className="w-full h-full p-4 relative">
					<video ref={ref} className="w-full h-full" />
					{error && (
						<p className="text-red-500 mt-2 text-center text-sm">{error}</p>
					)}
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 dark:border-gray-600 w-48 h-48"></div>
				</div>
			</div>
			<BottomNav />
		</div>
	);
};

export default ScanBarcode;
