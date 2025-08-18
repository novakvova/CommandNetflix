import React from "react";
import { NavLink } from "react-router-dom";
import "./MainPage.css";

import searchIcon from "../assets/search.png";
import homeIcon from "../assets/home.png";
import userIcon from "../assets/Group.png";

import ImageList from "../components/MainImageComponents/ImageList";
import { movies } from "../components/MainImageComponents/moviesData";

export default function SearchPage() {
  return (
    <div className="main">
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

      <div className="content">
        <div className="topbar">
          <div className="search-box">
            <button className="search-btn">
              <img src={searchIcon} alt="Search" />
            </button>
            <input type="text" placeholder="Знайти фільм" />
          </div>

          <div className="user-section">
            <img src={userIcon} alt="User" className="user-icon" />
            <div className="profile">Вихід</div>
          </div>
        </div>

        <ImageList images={movies} />
      </div>
    </div>
  );
}
