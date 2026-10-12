
import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext(null);

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  function toggleFavorite(movie) {
    setFavorites((old) =>
      old.some((item) => item.id === movie.id)
        ? old.filter((item) => item.id !== movie.id)
        : [...old, movie]
    );
  }

  return (
    <MovieContext.Provider
      value={{ favorites, toggleFavorite, darkMode, setDarkMode }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovies() {
  return useContext(MovieContext);
}
