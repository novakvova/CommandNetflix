import { useState, useMemo } from "react";
import "./ImageList.css";
import { Dropdown } from "primereact/dropdown";

export interface Movie {
  title: string;
  img: string;
  description?: string;
  youTubeCode?: string;
  rating?: number;
}

interface ImageListProps {
  images: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function ImageList({ images, onMovieClick }: ImageListProps) {
  const [sortOption, setSortOption] = useState<string | null>(null);

  const sortOptions = [
    { label: "За назвою (А → Я)", value: "titleAsc" },
    { label: "За назвою (Я → А)", value: "titleDesc" },
    { label: "За рейтингом (високий → низький)", value: "ratingDesc" },
    { label: "За рейтингом (низький → високий)", value: "ratingAsc" },
  ];

  const sortedMovies = useMemo(() => {
    const sorted = [...images];
    const getRating = (m: Movie) => Number(m?.rating ?? 0);

    switch (sortOption) {
      case "titleAsc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "ratingAsc":
        sorted.sort((a, b) => {
          const diff = getRating(a) - getRating(b);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      case "ratingDesc":
        sorted.sort((a, b) => {
          const diff = getRating(b) - getRating(a);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [images, sortOption]);

  return (
    <>
      <div className="card flex justify-content-center Dropdown">
        <Dropdown
          value={sortOption}
          onChange={(e: any) => setSortOption(e.value)}
          options={sortOptions}
          optionLabel="label"
          placeholder="Сортувати фільми"
          className="w-full md:w-14rem"
        />
      </div>

      <div className="image-list">
        {sortedMovies.map((movie, index) => (
          <div
            key={index}
            className="image-item"
            onClick={() => onMovieClick(movie)}
          >
            <img src={movie.img} alt={movie.title} />

            {movie.rating !== undefined && (
              <span className="rating">⭐ {movie.rating.toFixed(1)}</span>
            )}

            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}
