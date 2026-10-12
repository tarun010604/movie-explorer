
import { useEffect, useState } from "react";
import { Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { getTrendingMovies, searchMovies } from "../services/movieApi";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(() => localStorage.getItem("lastSearch") || "");
  const [submitted, setSubmitted] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=" +
      import.meta.env.VITE_TMDB_API_KEY)
      .then((r) => {
        if (!r.ok) throw new Error("Genres unavailable");
        return r.json();
      })
      .then((data) => setGenres(data.genres || []))
      .catch(() => setError("Could not load genres."));
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = submitted
          ? await searchMovies(submitted, page)
          : await getTrendingMovies(page);

        if (!active) return;
        setMovies((old) => page === 1 ? data.results : [...old, ...data.results]);
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch {
        if (active) setError("Movie loading failed. Check your API key and connection.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [submitted, page]);

  function handleSearch(event) {
    event.preventDefault();
    const value = query.trim();
    localStorage.setItem("lastSearch", value);
    setMovies([]);
    setPage(1);
    setSubmitted(value);
  }

  const filteredMovies = genre
    ? movies.filter((movie) => movie.genre_ids?.includes(Number(genre)))
    : movies;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {submitted ? `Search: ${submitted}` : "Trending Movies"}
      </Typography>

      <Box component="form" onSubmit={handleSearch}
        sx={{ display: "flex", gap: 1, mb: 3, maxWidth: 750 }}>
        <TextField fullWidth size="small" label="Search movies"
          value={query} onChange={(e) => setQuery(e.target.value)} />
        <Button type="submit" variant="contained">Search</Button>
        <Button onClick={() => {
          setQuery("");
          localStorage.removeItem("lastSearch");
          setMovies([]);
          setPage(1);
          setSubmitted("");
        }}>Clear</Button>
      </Box>

      <TextField select label="Filter by genre" size="small"
        value={genre} onChange={(e) => setGenre(e.target.value)}
        sx={{ minWidth: 220, mb: 3 }}>
        <MenuItem value="">All genres</MenuItem>
        {genres.map((item) => (
          <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
        ))}
      </TextField>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {loading && <Typography sx={{ mb: 2 }}>Loading movies...</Typography>}

      <Box sx={{ display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2,minmax(0,1fr))",
          sm: "repeat(3,minmax(0,1fr))",
          md: "repeat(4,minmax(0,1fr))",
          lg: "repeat(5,minmax(0,1fr))"
        }, gap: 2 }}>
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>

      {!loading && !error && filteredMovies.length === 0 &&
        <Typography sx={{ mt: 3 }}>No movies found.</Typography>}

      {!loading && page < totalPages && movies.length > 0 &&
            <Box sx={{ textAlign: "center" , mt: 4}} >
            <Button variant="contained"
                onClick={() => setPage((old) => old + 1)}>
                Load More
            </Button>
            </Box>}
    </Container>
  );
}
