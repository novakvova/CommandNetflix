import React, { useState } from "react";
import "./ImageList.css";
import { Dropdown } from "primereact/dropdown";
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
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];
  return (
    <>
      <div className="card flex justify-content-center Dropdown">
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={cities}
          optionLabel="name"
          placeholder="Sort Films"
          className="w-full md:w-14rem"
        />
      </div>
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
    </>
  );
}
