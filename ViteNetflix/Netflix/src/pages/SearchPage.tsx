import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import userIcon from "../assets/Group.png";
import { useAuth } from "../AuthContext";
import ImageList, { type Movie } from "../components/MainImageComponents/ImageList";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";
import Banner from "../components/Banner/Banner";
import TrailerModal from "../components/TrailerModal/TrailerModal";

const API_URL = "http://localhost:5045/api/trailers";

export default function SearchPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // стан пошуку
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // стан для трейлерів / банера
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [youTubeCode, setYouTubeCode] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // fetch при зміні debouncedQuery
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

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: any[]) => {
        setMovies(
          (data || []).map((t: any) => ({
            title: t.title,
            img: t.imageUrl,
            description: t.description || "Немає опису",
            youTubeCode: t.youTubeCode || "",
          }))
        );
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") {
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

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setYouTubeCode(null);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlayTrailer = () => {
    if (selectedMovie && selectedMovie.youTubeCode) {
      setYouTubeCode(selectedMovie.youTubeCode);
    } else {
      alert("Немає трейлера для цього фільму");
    }
  };

  return (
    <div className="main">
      <HeaderAndRightPanel>
        <div className="search-box">
          <button className="search-btn" onClick={() => setDebouncedQuery(query)}>
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

      <div className="content" ref={contentRef}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {selectedMovie && (
              <>
                <Banner
                  title={selectedMovie.title}
                  description={selectedMovie.description ?? ""}
                  youTubeCode={selectedMovie.youTubeCode ?? ""}
                  onPlayTrailer={handlePlayTrailer}
                />
                {youTubeCode && (
                  <TrailerModal
                    videoKey={youTubeCode}
                    onClose={() => setYouTubeCode(null)}
                  />
                )}
              </>
            )}
            <ImageList images={movies} onMovieClick={handleMovieClick} />
          </>
        )}
      </div>
    </div>
  );
}
