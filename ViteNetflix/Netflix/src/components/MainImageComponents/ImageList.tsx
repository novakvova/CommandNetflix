import React from "react";
import "./ImageList.css";

export interface Movie {
  title: string;
  img: string;
  description?: string;
  youTubeCode?: string;
}

interface ImageListProps {
  images: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export default function ImageList({ images, onMovieClick }: ImageListProps) {
  return (
    <div className="image-list">
      {images.map((movie, index) => (
        <div
          key={index}
          className="image-item"
          onClick={() => onMovieClick(movie)}
        >
          <img src={movie.img} alt={movie.title} />
          <p>{movie.title}</p>
        </div>
      ))}
    </div>
  );
}
