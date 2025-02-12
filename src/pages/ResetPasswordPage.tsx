import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

export default function ResetPasswordPage() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setError("Passwords don't match");
			return;
		}
		// Here you would typically call an API to reset the password
		// For this example, we'll just simulate the process
		console.log("Password reset to:", password);
		navigate("/login", {
			state: {
				message:
					"Password reset successful. Please log in with your new password.",
			},
		});
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 flex items-center justify-center py-12">
				<div className="w-full max-w-md space-y-8 px-4">
					<div className="space-y-2 text-center">
						<Link to="/">
							<img
								src="/logo-main.png"
								alt="Apollo Books"
								className="h-12 mx-auto"
							/>
						</Link>
						<h1 className="text-3xl font-bold">Reset Password</h1>
						<p className="text-muted-foreground">
							Enter your new password
						</p>
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="password">New Password</Label>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirm-password">
								Confirm New Password
							</Label>
							<Input
								id="confirm-password"
								type="password"
								required
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
							/>
						</div>
						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}
						<Button type="submit" className="w-full">
							Reset Password
						</Button>
					</form>
				</div>
			</main>
			<Footer />
		</div>
	);
}
