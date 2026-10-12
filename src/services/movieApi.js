import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

const movieApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getTrendingMovies = async (page = 1) => {
  const response = await movieApi.get("/trending/movie/week", {
    params: { page },
  });

  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await movieApi.get("/search/movie", {
    params: {
      query,
      page,
    },
  });

  return response.data;
};

export const getMovieDetails = async (movieId) => {
  const response = await movieApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: "videos,credits",
    },
  });

  return response.data;
};

export default movieApi;