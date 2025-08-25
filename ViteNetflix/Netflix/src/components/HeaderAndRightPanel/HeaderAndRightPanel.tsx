import { NavLink } from "react-router-dom";
import searchIcon from "../../assets/search.png";
import homeIcon from "../../assets/home.png";
import React from "react";
import "../../pages/MainPage.css";
interface Props {
  children?: React.ReactNode; // для кастомного контенту всередині topbar
}

export default function HeaderAndRightPanel({ children }: Props) {
  return (
    <>
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

      {/* Topbar */}
      <div className="topbar">{children}</div>
    </>
  );
}
