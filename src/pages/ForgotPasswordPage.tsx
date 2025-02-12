import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically call an API to initiate the password reset process
		// For this example, we'll just simulate the process
		console.log("Password reset requested for:", email);
		setIsSubmitted(true);
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
						<h1 className="text-3xl font-bold">Forgot Password</h1>
						<p className="text-muted-foreground">
							{isSubmitted
								? "Check your email for the reset link"
								: "Enter your email to receive a password reset link"}
						</p>
					</div>
					{!isSubmitted ? (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<Button type="submit" className="w-full">
								Send Reset Link
							</Button>
						</form>
					) : (
						<div className="text-center">
							<p className="mb-4">
								We've sent a password reset link to your email.
							</p>
							<Link to="/login">
								<Button variant="outline">Back to Login</Button>
							</Link>
						</div>
					)}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Remember your password?{" "}
							<Link
								to="/login"
								className="text-primary hover:underline"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
