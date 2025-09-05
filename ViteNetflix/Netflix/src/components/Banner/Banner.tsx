import React from "react";
import "./Banner.css";
import playImg from "../../assets/play.png";
import starRating from "../../assets/star.png";
//@ts-ignore
import { div } from "framer-motion/client";
interface BannerProps {
  title: string;
  description: string;
  youTubeCode: string;
  rating?: number;
  onPlayTrailer: () => void;
}

const Banner: React.FC<BannerProps> = ({
  title,
  description,
  youTubeCode,
  rating,
  onPlayTrailer,
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${youTubeCode}/maxresdefault.jpg`;

  return (
    <div className="banner" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
      <div className="banner-overlay">
        {rating !== undefined && (
          <div className="banner-rating">
            <img width="20px" src={starRating} alt="Рейтинг" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        <h1 className="banner-title">{title} </h1>
        <p className="banner-description">{description}</p>
        <button className="banner-btn" onClick={onPlayTrailer}>
          <img src={playImg} width="13px" alt="playBTN" /> Трейлер
        </button>
      </div>
    </div>
  );
};

export default Banner;
