import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/Footer";

export default function SignupPage() {
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
						<h1 className="text-3xl font-bold">
							Create an account
						</h1>
						<p className="text-muted-foreground">
							Enter your details to create your account
						</p>
					</div>
					<form className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="first-name">First name</Label>
								<Input id="first-name" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="last-name">Last name</Label>
								<Input id="last-name" required />
							</div>
						</div>
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
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" required />
						</div>
						<Button type="submit" className="w-full">
							Create account
						</Button>
					</form>
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
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
