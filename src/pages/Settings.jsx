import React from "react";
import BottomNav from "@/components/BottomNav";

const Settings = () => {
	return (
		<div className="min-h-screen bg-gradient-to-r from-primary to-primary/80 px-4">
			<div className="max-w-md mx-auto pt-12">
				<h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
					Settings
				</h1>
				<div className="bg-white bg-opacity-50 p-6 rounded-xl shadow-md">
					<p>This is a dummy settings page.</p>
					// ...existing code...
				</div>
			</div>
			<BottomNav />
		</div>
	);
};

export default Settings;
