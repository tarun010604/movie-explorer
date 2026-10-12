
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import MovieCard from "../components/MovieCard";
import {
  getTrendingMovies,
  searchMovies,
  getMovieGenres,
} from "../services/movieApi";

export default function Home() {
  const [movies, setMovies] = useState([]);

  const [query, setQuery] = useState(
    () => localStorage.getItem("lastSearch") || ""
  );

  const [submitted, setSubmitted] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [genreError, setGenreError] = useState("");

  // Load movie genres
  useEffect(() => {
    let active = true;

    async function loadGenres() {
      try {
        const data = await getMovieGenres();

        if (active) {
          setGenres(
            Array.isArray(data?.genres) ? data.genres : []
          );
          setGenreError("");
        }
      } catch (err) {
        console.error("Genre loading error:", err);

        if (active) {
          setGenres([]);
          setGenreError("Genre filters are currently unavailable.");
        }
      }
    }

    loadGenres();

    return () => {
      active = false;
    };
  }, []);

  // Load trending movies or search results
  useEffect(() => {
    let active = true;

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const data = submitted
          ? await searchMovies(submitted, page)
          : await getTrendingMovies(page);

        if (!active) return;

        const results = Array.isArray(data?.results)
          ? data.results
          : [];

        setMovies((previousMovies) =>
          page === 1
            ? results
            : [...previousMovies, ...results]
        );

        setTotalPages(
          Math.min(Number(data?.total_pages) || 1, 500)
        );

        if (results.length === 0 && !data?.results) {
          setError(
            "The movie API returned an unexpected response. Please try again."
          );
        }
      } catch (err) {
        console.error("Movie loading error:", err);

        if (active) {
          setError(
            "Unable to load movies. Check your connection and TMDb API configuration."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      active = false;
    };
  }, [submitted, page]);

  // Search movies
  function handleSearch(event) {
    event.preventDefault();

    const value = query.trim();

    localStorage.setItem("lastSearch", value);

    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError("");

    setSubmitted(value);
  }

  // Clear search and return to trending movies
  function handleClear() {
    setQuery("");
    setSubmitted("");
    setGenre("");
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError("");

    localStorage.removeItem("lastSearch");
  }

  // Filter movies by genre
  const filteredMovies = genre
    ? movies.filter((movie) =>
        Array.isArray(movie.genre_ids)
          ? movie.genre_ids.includes(Number(genre))
          : false
      )
    : movies;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        {submitted
          ? `Search: ${submitted}`
          : "Trending Movies"}
      </Typography>

      {/* Search form */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          maxWidth: 750,
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Search movies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ flex: "1 1 220px" }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Search
        </Button>

        <Button
          type="button"
          onClick={handleClear}
          variant="outlined"
        >
          Clear
        </Button>
      </Box>

      {/* Genre filter */}
      <TextField
        select
        label="Filter by genre"
        size="small"
        value={genre}
        onChange={(event) => setGenre(event.target.value)}
        sx={{ minWidth: 220, mb: 3 }}
      >
        <MenuItem value="">All genres</MenuItem>

        {(Array.isArray(genres) ? genres : []).map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>

      {genreError && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {genreError}
        </Typography>
      )}

      {/* Error message */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => {
              setPage(1);
              setMovies([]);
              setError("");

              // Re-trigger the request for the current search.
              setSubmitted((current) =>
                current === "" ? " " : current
              );
            }}
          >
            Retry
          </Button>
        </Box>
      )}

      {/* Loading message */}
      {loading && (
        <Typography sx={{ mb: 2 }}>
          Loading movies...
        </Typography>
      )}

      {/* Movie grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "repeat(5, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        {(Array.isArray(filteredMovies) ? filteredMovies : []).map(
          (movie) => (
            <MovieCard key={movie.id} movie={movie} />
          )
        )}
      </Box>

      {/* No results message */}
      {!loading && !error && filteredMovies.length === 0 && (
        <Typography sx={{ mt: 3 }}>
          {submitted
            ? "No movies found for this search."
            : "No movies available right now."}
        </Typography>
      )}

      {/* Load more */}
      {!loading &&
        !error &&
        page < totalPages &&
        movies.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => setPage((previousPage) => previousPage + 1)}
            >
              Load More
            </Button>
          </Box>
        )}
    </Container>
  );
}
