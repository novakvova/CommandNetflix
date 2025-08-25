import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import userIcon from "../assets/Group.png";
import { useAuth } from "../AuthContext";
import ImageList from "../components/MainImageComponents/ImageList";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";

const API_URL = "http://localhost:5045/api/trailers";

interface Movie {
  title: string;
  img: string;
}

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setLoading(true);

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const url = debouncedQuery
      ? `${API_URL}?search=${encodeURIComponent(debouncedQuery)}`
      : API_URL;

    console.log("[SearchPage] fetch:", url);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any[]) => {
        console.log("[SearchPage] items:", data.length);
        setMovies(
          (data || []).map((t: any) => ({
            title: t.title,
            img: t.imageUrl,
          }))
        );
      })
      .catch((err) => {
        if ((err as any).name === "AbortError") {
          console.log("[SearchPage] fetch aborted");
        } else {
          console.error("[SearchPage] fetch error:", err);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // обов’язкова функція для ImageList
  const handleMovieClick = (movie: Movie) => {
    console.log("Вибрано фільм:", movie.title);
    // тут можна буде відкрити Banner або трейлер
  };

  return (
    <div className="main">
      <HeaderAndRightPanel>
        <div className="search-box">
          <button
            className="search-btn"
            onClick={() => setDebouncedQuery(query)}
          >
            <img src={searchIcon} alt="Search" />
          </button>
          <input
            type="text"
            placeholder="Знайти фільм"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="header-search-input"
          />
        </div>

        <div className="user-section">
          <img src={userIcon} alt="User" className="user-icon" />
          <div className="profile" onClick={handleLogout}>
            Вихід
          </div>
        </div>
      </HeaderAndRightPanel>

      {/* Контент */}
      <div className="content">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ImageList images={movies} onMovieClick={handleMovieClick} />
        )}
      </div>
    </div>
  );
}
