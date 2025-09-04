import { useState, useMemo, useEffect } from "react";
import "./ImageList.css";
import { Dropdown } from "primereact/dropdown";
import bookmarkDefault from "../../assets/bookmarkDefault.png";
import bookmarkActive from "../../assets/bookmarkActive.png";
import { useAuth } from "../../AuthContext";

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number; // <-- додано
  title: string;
  img: string;
  description?: string;
  youTubeCode?: string;
  rating?: number;
  genres?: Genre[];
  genreIds?: number[];
}


interface ImageListProps {
  images: any; // сирі дані з API
  onMovieClick: (movie: Movie) => void;
}

export default function ImageList({ images, onMovieClick }: ImageListProps) {
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [genre, setGenre] = useState<number | null>(null);
  const { user } = useAuth();

  // bookmarks у localStorage
  const [bookmarks, setBookmarks] = useState<{ [key: string]: boolean }>({});
  const userBookmarksKey = `bookmarks_user_${user?.id}`;

useEffect(() => {
  if (!user) return;
  const saved = localStorage.getItem(userBookmarksKey);
  if (saved) {
    setBookmarks(JSON.parse(saved));
  } else {
    setBookmarks({});
  }
}, [user]);

const toggleBookmark = async (movie: Movie) => {
  const userId = user?.id;
  if (!userId) {
    alert("Користувач не авторизований");
    return;
  }

  const key = movie.title;
  const isBookmarked = !!bookmarks[key];

  // оновлюємо UI
  setBookmarks((prev) => {
    const newBookmarks = { ...prev, [key]: !isBookmarked };
    localStorage.setItem(userBookmarksKey, JSON.stringify(newBookmarks)); // <-- динамічний ключ
    return newBookmarks;
  });

  try {
    const url = `http://localhost:5045/api/FavoriteTrailers/${userId}/${movie.id}`;
    const method = isBookmarked ? "DELETE" : "POST";
    const res = await fetch(url, { method });

    if (!res.ok) throw new Error("Помилка при оновленні улюблених на сервері");

    console.log(
      !isBookmarked
        ? `Фільм "${movie.title}" додано в улюблені (API)`
        : `Фільм "${movie.title}" видалено з улюблених (API)`
    );
  } catch (err) {
    console.error(err);
    // якщо помилка — повертаємо попередній стан
    setBookmarks((prev) => ({ ...prev, [key]: isBookmarked }));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
};



const formattedMovies: Movie[] = useMemo(() => {
  if (!images) return [];
  return images.map((m: any) => ({
    id: m.id ?? `movie-${m.title ?? Math.random()}`, // гарантовано унікальний id
    title: m.title ?? "Без назви",
    img: m.img ?? "",
    rating: m.rating ?? 0,
    description: m.description ?? "Немає опису",
    youTubeCode: m.youTubeCode ?? "",
    genres: m.genres ?? [],
    genreIds: m.genreIds ?? [],
  }));
}, [images]);



  // Генеруємо список жанрів із переданих фільмів
  const genres = useMemo(() => {
    const allGenres: { [key: number]: string } = {};
    formattedMovies.forEach((m) => {
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
    return formattedMovies.filter((m) => m.genreIds?.includes(genre));
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
            key={`${movie.id}-${movie.title}`}
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
              toggleBookmark(movie);
            }}
          />


            <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}