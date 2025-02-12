import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookGrid from "@/components/BookGrid";
import Footer from "@/components/Footer";
import CategoryCarousel from "@/components/CategoryCarousel";
import CollectionCarousel from "@/components/CollectionCarousel";

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="flex items-center space-x-2">
							<img
								src="/logo.png"
								alt="Apollo Books"
								className="h-12"
							/>
						</Link>
						<div className="flex-1 max-w-xl mx-4">
							<div className="relative">
								<Input
									type="search"
									placeholder="Search books..."
									className="w-full pl-4 pr-10"
								/>
								<Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Link to="/login">
								<Button variant="ghost">Sign in</Button>
							</Link>
							<Link to="/signup">
								<Button>Sign up</Button>
							</Link>
							<Button variant="ghost" size="icon">
								<ShoppingCart className="h-5 w-5" />
								<span className="sr-only">Shopping Cart</span>
							</Button>
						</div>
					</div>
					<nav className="mt-4">
						<CategoryCarousel />
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<div className="container mx-auto px-4 py-8 space-y-12">
					<section>
						<h2 className="text-3xl font-bold mb-6 antialiased italic font-stretch-extra-expanded uppercase">
							Our Books
						</h2>
						<BookGrid />
					</section>

					<section>
						<h2 className="text-3xl font-bold mb-6 antialiased italic font-stretch-extra-expanded uppercase">
							Our Collections
						</h2>
						<CollectionCarousel />
					</section>
				</div>
			</main>

			<Footer />
		</div>
	);
}
