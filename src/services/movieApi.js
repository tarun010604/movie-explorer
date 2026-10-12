
import axios from "axios";

const movieApi = axios.create({
  baseURL: "/.netlify/functions",
});

async function request(endpoint, params = {}) {
  const response = await movieApi.get("/tmdb", {
    params: { endpoint, ...params },
  });

  return response.data;
}

export const getTrendingMovies = (page = 1) =>
  request("trending/movie/week", { page });

export const searchMovies = (query, page = 1) =>
  request("search/movie", { query, page });

export const getMovieDetails = (movieId) =>
  request(`movie/${movieId}`, {
    append_to_response: "videos,credits",
  });

export const getMovieGenres = () =>
  request("genre/movie/list");

export default movieApi;
