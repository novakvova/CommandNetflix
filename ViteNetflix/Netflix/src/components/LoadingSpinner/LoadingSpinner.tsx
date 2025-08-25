import React from "react";
import { motion } from "framer-motion";
import "./LoadingSpinner.css"; // додай цей файл

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loader-container">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
