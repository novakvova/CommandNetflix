import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import userIcon from "../assets/Group.png";
import { useAuth } from "../AuthContext";
import ImageList, {
  type Movie,
} from "../components/MainImageComponents/ImageList";
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [youTubeCode, setYouTubeCode] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setMovies(
          data.map((t: any) => ({
            title: t.title,
            img: t.imageUrl,
            description: t.description || "Немає опису",
            youTubeCode: t.youTubeCode || "",
          }))
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          <button className="search-btn">
            <img src={searchIcon} alt="Search" />
          </button>
          <input type="text" placeholder="Знайти фільм" />
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
