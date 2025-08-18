type Movie = {
  title: string;
  img: string;
};

type ImageListProps = {
  images: Movie[];
};
import "./ImageList.css";
export default function ImageList({ images }: ImageListProps) {
  return (
    <div className="image-list">
      {images.map((movie, index) => (
        <div key={index} className="image-item">
          <img src={movie.img} alt={movie.title} />
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
}
