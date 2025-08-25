import React from "react";
import "./TrailerModal.css";

interface TrailerModalProps {
  videoKey: string | null;
  onClose: () => void;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
