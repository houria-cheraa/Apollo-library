import SearchBar from "@/components/Navbar";
import "./HomePge.css";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

  return (
	<>

    <header>
        <img src="./logo.png" width={200} height={80}/>
        <div>
            <SearchBar onSearch={(query) => console.log(query)} />
        </div>
        <div className="auth-buttons">
            <button className="sign-up" onClick={() => navigate("signup")}>Sign up</button>
            <button className="sign-in" onClick={() => navigate("login")}>Sign in</button>
        </div>
    </header>

    <nav className="categories">
        <Button onClick={() => navigate("login")}>Fantasy</Button>
        <Button onClick={() => navigate("login")}>Sci-Fi</Button>
        <Button onClick={() => navigate("login")}>Mystery</Button>
        <Button onClick={() => navigate("login")}>Thriller</Button>
        <Button onClick={() => navigate("login")}>Romance</Button>
        <Button onClick={() => navigate("login")}>Horror</Button>
        <Button onClick={() => navigate("login")}>History</Button>
        <Button onClick={() => navigate("login")}>Adventure</Button>
        <Button onClick={() => navigate("login")}>Poetry</Button>
        <Button onClick={() => navigate("login")}>Comics</Button>
        <Button onClick={() => navigate("login")}>Crime</Button>
        <Button onClick={() => navigate("login")}>Mythology</Button>
    </nav>

    <section className="featured-books">
        <h2>Our Books</h2>
        <div className="book-list">
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
        </div>
    </section>

    <section className="collections">
        <h2 onClick={() => navigate("login")}>Our Collections</h2> // to be changed
        <div className="collection-item">
            <div className="collection-text">
                <h3>“OUTLANDER”</h3>
                <p>Follow the epic love story of Claire Randall, 
                    a World War II nurse, and Jamie Fraser, a Scottish Highlander,
                     as they navigate time travel and historical challenges.</p>
            </div>
            <div className="book-placeholder collection-placeholder" onClick={() => navigate("login")}></div> // to be changed
        </div>
    </section>

    <section className="cook-books">
        <h2>Our New Cook Books</h2>
        <div className="book-list">
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed 
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed 
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
            <div className="book-placeholder" onClick={() => navigate("login")}></div> // to be changed
        </div>
    </section>

</>
  );
}
