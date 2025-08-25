import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import userIcon from "../assets/Group.png";
import HeaderAndRightPanel from "../components/HeaderAndRightPanel/HeaderAndRightPanel";
import ImageList from "../components/MainImageComponents/ImageList";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <HeaderAndRightPanel>
        <div className="user-section">
          <img src={userIcon} alt="User" className="user-icon" />
          <div className="profile" onClick={handleLogout}>
            Вихід
          </div>
        </div>
      </HeaderAndRightPanel>

      <div className="content">
        {loading ? <LoadingSpinner /> : <ImageList images={movies} />}
      </div>
    </div>
  );
}
