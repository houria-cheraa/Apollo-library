import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

export default function LoginPage() {
	const [message, setMessage] = useState("");
	const location = useLocation();

	useEffect(() => {
		if (location.state && location.state.message) {
			setMessage(location.state.message);
		}
	}, [location]);

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
						<h1 className="text-3xl font-bold">Welcome back</h1>
						<p className="text-muted-foreground">
							Enter your email to sign in to your account
						</p>
					</div>
					{message && (
						<div
							className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
							role="alert"
						>
							<span className="block sm:inline">{message}</span>
						</div>
					)}
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									to="/forgot-password"
									className="text-sm text-primary hover:underline"
								>
									Forgot your password?
								</Link>
							</div>
							<Input id="password" type="password" required />
						</div>
						<Button type="submit" className="w-full">
							Sign in
						</Button>
					</form>
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-primary hover:underline"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
