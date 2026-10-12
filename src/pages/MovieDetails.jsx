
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { getMovieDetails } from "../services/movieApi";

const IMAGE = "https://image.tmdb.org/t/p/w500";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMovieDetails(id)
      .then((data) => { if (active) setMovie(data); })
      .catch(() => { if (active) setError("Could not load movie details."); });
    return () => { active = false; };
  }, [id]);

  if (error) return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  if (!movie) return <Typography sx={{ p: 4 }}>Loading details...</Typography>;

  const trailer = movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) || movie.videos?.results?.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {movie.poster_path && (
          <Box component="img" src={IMAGE + movie.poster_path}
            alt={movie.title}
            sx={{ width: { xs: "100%", md: 300 }, maxWidth: 300, borderRadius: 2, alignSelf: "flex-start" }} />
        )}
        <Box>
          <Typography variant="h3">{movie.title}</Typography>
          <Typography sx={{ mt: 2 }}>Release date: {movie.release_date || "Unknown"}</Typography>
          <Typography>Rating: {movie.vote_average?.toFixed(1)}/10</Typography>
          <Typography sx={{ mt: 1 }}>
            Genres: {movie.genres?.map((g) => g.name).join(", ") || "Unknown"}
          </Typography>
          <Typography variant="h6" sx={{ mt: 3 }}>Overview</Typography>
          <Typography>{movie.overview || "No description available."}</Typography>
          <Typography variant="h6" sx={{ mt: 3 }}>Trailer</Typography>
          {trailer ? (
            <a href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank" rel="noreferrer">Watch trailer on YouTube</a>
          ) : <Typography>No trailer available.</Typography>}
        </Box>
      </Box>
    </Container>
  );
}
