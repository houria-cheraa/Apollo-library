import { Link } from "react-router-dom";

const books = [
	{
		title: "Harry Potter",
		author: "J.K. Rowling",
		image: "/placeholder.svg",
	},
	{
		title: "The Last House on Needless Street",
		author: "Catriona Ward",
		image: "/placeholder.svg",
	},
	{
		title: "The Girl with the Dragon Tattoo",
		author: "Stieg Larsson",
		image: "/placeholder.svg",
	},
	{
		title: "Ender's Game",
		author: "Orson Scott Card",
		image: "/placeholder.svg",
	},
];

export default function BookGrid() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
			{books.map((book) => (
				<Link key={book.title} to="#" className="space-y-2 group">
					<div className="aspect-[2/3] relative">
						<img
							src={book.image || "/placeholder.svg"}
							alt={book.title}
							className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
						/>
					</div>
					<div className="text-center">
						<h3 className="font-medium line-clamp-1">
							{book.title}
						</h3>
						<p className="text-sm text-muted-foreground">
							{book.author}
						</p>
					</div>
				</Link>
			))}
		</div>
	);
}
