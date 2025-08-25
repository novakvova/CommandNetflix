import { NavLink } from "react-router-dom";
import searchIcon from "../../assets/search.png";
import homeIcon from "../../assets/home.png";
import React, { useState } from "react";
import type { ChangeEvent } from "react";
import "../../pages/MainPage.css";

interface Props {
  children?: React.ReactNode;
  onSearch?: (term: string) => void;
}

export default function HeaderAndRightPanel({ children, onSearch }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    if (onSearch) {
      onSearch(v); // миттєво передаємо — debounce робимо на MainPage
    }
  };

  return (
    <>
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

      {/* Topbar */}
      <div className="topbar">
        {/* Пошуковий інпут */}
        {onSearch && (
          <input
            className="header-search-input"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Пошук фільмів..."
            aria-label="search"
          />
        )}
        {children}
      </div>
    </>
  );
}
