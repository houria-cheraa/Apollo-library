import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="space-y-4">
						<h3 className="font-semibold">About</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									About Us
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Careers
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Press
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Support</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Safety Center
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Community Guidelines
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Legal</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Cookies Policy
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									to="#"
									className="text-muted-foreground hover:text-foreground"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
					<div className="space-y-4">
						<h3 className="font-semibold">Connect with us</h3>
						<div className="flex space-x-4">
							<Link
								to="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Facebook className="h-6 w-6" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link
								to="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Instagram className="h-6 w-6" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link
								to="#"
								className="text-muted-foreground hover:text-foreground"
							>
								<Twitter className="h-6 w-6" />
								<span className="sr-only">Twitter</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="mt-8 pt-8 border-t text-center text-muted-foreground">
					<p>
						&copy; {new Date().getFullYear()} Apollo Books. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
