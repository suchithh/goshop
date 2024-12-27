import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User, ScanBarcode, Settings, Home } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const BottomNav = () => {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg">
			<div
				className="bg-background/80 backdrop-blur-lg rounded-full p-2 
                    shadow-lg shadow-black/5 
                    flex items-center justify-between
                    border border-border/50"
			>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/")}
					className={cn(
						"rounded-full transition-colors",
						location.pathname === "/" && "bg-primary/10 text-primary"
					)}
				>
					<Home className="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/cart")}
					className={cn(
						"rounded-full transition-colors",
						location.pathname === "/cart" && "bg-primary/10 text-primary"
					)}
				>
					<ShoppingCart className="h-5 w-5" />
				</Button>

				<div className="-mt-8 relative">
					<Button
						variant="default"
						size="icon"
						onClick={() => navigate("/scan")}
						className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 
                     shadow-lg shadow-primary/20 transition-all
                     hover:shadow-xl hover:shadow-primary/30"
					>
						<ScanBarcode className="h-6 w-6" />
					</Button>
				</div>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/settings")}
					className={cn(
						"rounded-full transition-colors",
						location.pathname === "/settings" && "bg-primary/10 text-primary"
					)}
				>
					<Settings className="h-5 w-5" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate("/account")}
					className={cn(
						"rounded-full transition-colors",
						location.pathname === "/account" && "bg-primary/10 text-primary"
					)}
				>
					<User className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
};

export default BottomNav;
