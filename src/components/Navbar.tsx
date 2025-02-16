import { useState } from "react";
import "./Navbar.css"

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="search-bar">
      <input
	    src="./public/Vector.svg"
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <img src="./public/Vector.svg" 
	  width={25}
	  height={30}
	  onClick={() => onSearch(query)}
	  
	  />
    </div>
  );
};

export default SearchBar;
