import { movies } from "./moviesData"; // Шлях залежить від структури папок
import ImageList from "./ImageList";

export default function MoviesComponent() {
  return <ImageList images={movies} />;
}
