import { useState, useMemo, useEffect } from "react";
import "./ImageList.css";
import { Dropdown } from "primereact/dropdown";
import bookmarkDefault from "../../assets/bookmarkDefault.png";
import bookmarkActive from "../../assets/bookmarkActive.png";

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  title: string;
  img: string;
  description?: string;
  youTubeCode?: string;
  rating?: number;
  genres?: Genre[];
  genreIds?: number[];
}

interface ImageListProps {
  images: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function ImageList({ images, onMovieClick }: ImageListProps) {
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [genre, setGenre] = useState<number | null>(null);

  // bookmarks у localStorage
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const toggleBookmark = (title: string) => {
    setBookmarks((prev) => {
      const updated = { ...prev, [title]: !prev[title] };
      localStorage.setItem("bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  // Генеруємо список жанрів із переданих фільмів
  const genres = useMemo(() => {
    const allGenres: { [key: number]: string } = {};
    images.forEach((m) => {
      m.genres?.forEach((g) => {
        allGenres[g.id] = g.name;
      });
    });
    return [
      { label: "Усі жанри", value: null },
      ...Object.entries(allGenres).map(([id, name]) => ({
        label: name,
        value: Number(id),
      })),
    ];
  }, [images]);

  // Фільтрація за жанрами
  const filteredMovies = useMemo(() => {
    if (!genre) return images;
    return images.filter((m) => m.genreIds?.includes(genre));
  }, [images, genre]);

  // Сортування
  const sortedMovies = useMemo(() => {
    const sorted = [...filteredMovies];
    const getRating = (m: Movie) => Number(m?.rating ?? 0);

    switch (sortOption) {
      case "titleAsc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "ratingAsc":
        sorted.sort((a, b) => getRating(a) - getRating(b));
        break;
      case "ratingDesc":
        sorted.sort((a, b) => getRating(b) - getRating(a));
        break;
    }

    return sorted;
  }, [filteredMovies, sortOption]);

  return (
    <>
      <div className="card flex justify-content-center Dropdown">
        <Dropdown
          value={sortOption}
          onChange={(e: { value: string | null }) => setSortOption(e.value)}
          options={[
            { label: "За назвою (А → Я)", value: "titleAsc" },
            { label: "За назвою (Я → А)", value: "titleDesc" },
            {
              label: "За рейтингом (високий → низький)",
              value: "ratingDesc",
            },
            {
              label: "За рейтингом (низький → високий)",
              value: "ratingAsc",
            },
          ]}
          optionLabel="label"
          placeholder="Сортувати фільми"
          className="w-full md:w-14rem"
        />

        <Dropdown
          value={genre}
          onChange={(e: { value: number | null }) => setGenre(e.value)}
          options={genres}
          optionLabel="label"
          optionValue="value"
          placeholder="Фільтрувати по жанрах"
          className="w-full md:w-14rem"
        />
      </div>

      <div className="image-list">
        {sortedMovies.map((movie) => (
          <div
            key={movie.title}
            className="image-item"
            onClick={() => onMovieClick(movie)}
          >
            <img src={movie.img} alt={movie.title} />
            {movie.rating !== undefined && (
              <span className="rating">⭐ {movie.rating.toFixed(1)}</span>
            )}

            <img
              src={bookmarks[movie.title] ? bookmarkActive : bookmarkDefault}
              alt="bookmark"
              className="bookmark-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(movie.title);
              }}
            />

            <p>{movie.title}</p>
            <small className="genres">
              Жанри: {movie.genres?.map((g) => g.name).join(", ") || "немає"}
            </small>
          </div>
        ))}
      </div>
    </>
  );
}
