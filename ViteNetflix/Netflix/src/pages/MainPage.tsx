import React from "react";
import { NavLink } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import homeIcon from "../assets/home.png";
import userIcon from "../assets/Group.png";

import ImageList from "../components/MainImageComponents/ImageList"; // компонент для мініатюр
import { movies } from "../components/MainImageComponents/moviesData"; // масив фільмів

export default function MainPage() {
  return (
    <div className="main">
      {/* Sidebar */}
      <div className="sidebar">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `icon search ${isActive ? "active" : ""}`
          }
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
            <div className="profile">Вихід</div>
          </div>
        </div>

        {/* Список мініатюр */}
        <ImageList images={movies} />
      </div>
    </div>
  );
}
