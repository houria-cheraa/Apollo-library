"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const collections = [
	{
		title: "OUTLANDER",
		description:
			"Follow the epic love story of Claire Randall, a World War II nurse, and Jamie Fraser, a Scottish Highlander, as they navigate time travel and historical challenges.",
		image: "/placeholder.svg",
	},
	{
		title: "HARRY POTTER",
		description:
			"Join Harry Potter and his friends on their magical adventures at Hogwarts School of Witchcraft and Wizardry.",
		image: "/placeholder.svg",
	},
	{
		title: "THE LORD OF THE RINGS",
		description:
			"Embark on an epic quest to destroy the One Ring and save Middle-earth from the dark lord Sauron.",
		image: "/placeholder.svg",
	},
];

export default function CollectionCarousel() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextCollection = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
	};

	const prevCollection = () => {
		setCurrentIndex(
			(prevIndex) =>
				(prevIndex - 1 + collections.length) % collections.length
		);
	};

	const currentCollection = collections[currentIndex];

	return (
		<div className="relative">
			<div className="flex justify-between items-center mx-8 md:mx-16">
				<div className="w-1/2 pr-6 md:ml-12 md:pr-10">
					<h3 className="text-2xl font-bold mb-4">
						"{currentCollection.title}"
					</h3>
					<p className="text-muted-foreground mb-6">
						{currentCollection.description}
					</p>
					<Button className="group">
						Explore Collection
						<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
					</Button>
				</div>
				<div className="w-1/2 pl-6 md:pl-10">
					<img
						src={currentCollection.image || "/placeholder.svg"}
						alt={currentCollection.title}
						className="w-full h-[400px] object-contain"
					/>
				</div>
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-0 top-1/2 -translate-y-1/2"
				onClick={prevCollection}
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-0 top-1/2 -translate-y-1/2"
				onClick={nextCollection}
			>
				<ChevronRight className="h-6 w-6" />
			</Button>
		</div>
	);
}
