import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import userIcon from "../assets/Group.png";
import { useAuth } from "../AuthContext";
import ImageList from "../components/MainImageComponents/ImageList";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";
const API_URL = "http://localhost:5045/api/trailers";

// Тип для фільмів
interface Movie {
  title: string;
  img: string;
}

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: { title: string; imageUrl: string }[]) =>
        setMovies(
          data.map((t) => ({
            title: t.title,
            img: t.imageUrl,
          }))
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="main">
      <HeaderAndRightPanel>
        <div className="search-box">
          <button className="search-btn">
            <img src={searchIcon} alt="Search" />
          </button>
          <input type="text" placeholder="Знайти фільм" />
        </div>

        <div className="user-section">
          <img src={userIcon} alt="User" className="user-icon" />
          <div className="profile" onClick={handleLogout}>
            Вихід
          </div>
        </div>
      </HeaderAndRightPanel>

      {/* Контент */}
      <div className="content">
        {loading ? <LoadingSpinner /> : <ImageList images={movies} />}
      </div>
    </div>
  );
}
