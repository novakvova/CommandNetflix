import { NavLink, useNavigate } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import homeIcon from "../assets/home.png";
import userIcon from "../assets/Group.png";

import ImageList from "../components/MainImageComponents/ImageList";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5045/api/trailers";

export default function MainPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [movies, setMovies] = useState<{ title: string; img: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) =>
        setMovies(
          data.map((t: any) => ({
            title: t.title,
            img: t.imageUrl,
          }))
        )
      )
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="main">
      {/* Sidebar */}
      <div className="sidebar">
        <NavLink
          to="/search"
          className={({ isActive }) => `icon search ${isActive ? "active" : ""}`}
        >
          <img src={searchIcon} alt="Search" />
        </NavLink>
        <NavLink
          to="/home"
          className={({ isActive }) => `icon home ${isActive ? "active" : ""}`}
        >
          <img src={homeIcon} alt="Home" />
        </NavLink>
      </div>

      {/* Content */}
      <div className="content">
        {/* Topbar */}
        <div className="topbar">
          <div className="user-section">
            <img src={userIcon} alt="User" className="user-icon" />
            <div className="profile" onClick={handleLogout}>
              Вихід
            </div>
          </div>
        </div>

        {/* Список мініатюр */}
        {loading ? (
          <div>Завантаження...</div>
        ) : (
          <ImageList images={movies} />
        )}
      </div>
    </div>
  );
}
