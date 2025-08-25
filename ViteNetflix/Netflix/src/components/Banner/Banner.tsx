import React from "react";
import "./Banner.css";
import playImg from "../../assets/play.png";
interface BannerProps {
  title: string;
  description: string;
  youTubeCode: string; // <-- тут
  onPlayTrailer: () => void;
}

const Banner: React.FC<BannerProps> = ({
  title,
  description,
  youTubeCode,
  onPlayTrailer,
}) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${youTubeCode}/maxresdefault.jpg`;

  return (
    <div className="banner" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
      <div className="banner-overlay">
        <h1 className="banner-title">{title}</h1>
        <p className="banner-description">{description}</p>
        <button className="banner-btn" onClick={onPlayTrailer}>
          <img src={playImg} width="13px" alt="playBTN" /> Трейлер
        </button>
      </div>
    </div>
  );
};

export default Banner;
