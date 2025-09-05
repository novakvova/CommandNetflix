import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import userIcon from "../assets/Group.png";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";
import ImageList, { type Movie } from "../components/MainImageComponents/ImageList";
import { useAuth } from "../AuthContext";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import Banner from "../components/Banner/Banner";
import TrailerModal from "../components/TrailerModal/TrailerModal";

export default function SavedMoviesPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [youTubeCode, setYouTubeCode] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

useEffect(() => {
  if (!user) return;

  fetch(`http://3.70.134.171:5819/api/FavoriteTrailers/${user.id}`)
    .then(res => res.json())
    .then(data => {
      const moviesArray = data.$values ?? [];

      const favMovies: Movie[] = moviesArray.map((t: any, index: number) => {
        const genres: { id: number; name: string }[] =
          t.genres?.$values?.map((g: any) => ({
            id: g.id,
            name: g.name
          })) ?? [];

        return {
          id: t.id ?? `movie-${index}`,
          title: t.title ?? "Без назви",
          img: t.imageUrl ?? "",
          description: t.description ?? "Немає опису",
          youTubeCode: t.youTubeCode ?? "",
          rating: t.rating ?? 0,
          genres: genres,
          genreIds: genres.map(g => g.id)
        };
      });

      setSavedMovies(favMovies);
    })
    .catch(err => console.error("Error fetching favorites:", err))
    .finally(() => setLoading(false));
}, [user]);



  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setYouTubeCode(null);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayTrailer = () => {
    if (selectedMovie?.youTubeCode) {
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
                  rating={selectedMovie.rating}
                />

                {youTubeCode && (
                  <TrailerModal
                    videoKey={youTubeCode}
                    onClose={() => setYouTubeCode(null)}
                  />
                )}
              </>
            )}

            <ImageList
              images={savedMovies}
              onMovieClick={handleMovieClick}
            />
          </>
        )}
      </div>
    </div>
  );
}
