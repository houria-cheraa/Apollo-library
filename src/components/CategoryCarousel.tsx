import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
	"Fantasy",
	"Sci-fi",
	"Mystery",
	"Thriller",
	"Romance",
	"Horror",
	"History",
	"Adventure",
	"Poetry",
	"Comics",
	"Crime",
	"Mythology",
];

export default function CategoryCarousel() {
	const [startIndex, setStartIndex] = useState(0);
	const visibleCategories = 5;

	const nextCategories = () => {
		setStartIndex((prevIndex) =>
			prevIndex + visibleCategories >= categories.length
				? 0
				: prevIndex + 1
		);
	};

	const prevCategories = () => {
		setStartIndex((prevIndex) =>
			prevIndex === 0
				? categories.length - visibleCategories
				: prevIndex - 1
		);
	};

	return (
		<div className="relative flex items-center justify-center">
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-0 z-10"
				onClick={prevCategories}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<div className="flex justify-center overflow-hidden w-full px-10">
				{categories
					.slice(startIndex, startIndex + visibleCategories)
					.map((category) => (
						<Button
							key={category}
							variant="secondary"
							className="mx-1 whitespace-nowrap"
						>
							{category}
						</Button>
					))}
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 z-10"
				onClick={nextCategories}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
