import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import userIcon from "../assets/Group.png";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";
import ImageList, {
  type Movie,
} from "../components/MainImageComponents/ImageList";
import { useAuth } from "../AuthContext";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Banner from "../components/Banner/Banner";
import TrailerModal from "../components/TrailerModal/TrailerModal";

const API_URL = "http://localhost:5045/api/trailers";

export default function MainPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [youTubeCode, setYouTubeCode] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setMovies(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.map((t: any) => ({
            title: t.title,
            img: t.imageUrl,
            description: t.description || "Немає опису",
            youTubeCode: t.youTubeCode || "", // ключ YouTube
          }))
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setYouTubeCode(null);
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
