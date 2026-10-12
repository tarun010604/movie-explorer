
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useMovies } from "../context/MovieContext";

const IMAGE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }) {
  const { favorites, toggleFavorite } = useMovies();
  const favorite = favorites.some((item) => item.id === movie.id);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {movie.poster_path ? (
        <CardMedia
          component="img"
          image={`${IMAGE}${movie.poster_path}`}
          alt={movie.title}
          sx={{ height: 300, objectFit: "cover" }}
        />
      ) : (
        <div style={{ height: 300, display: "grid", placeItems: "center" }}>
          No poster available
        </div>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{movie.title}</Typography>
        <Typography variant="body2">
          Release: {movie.release_date || "Unknown"}
        </Typography>
        <Typography variant="body2">
          Rating: {movie.vote_average?.toFixed(1) ?? "N/A"}/10
        </Typography>
        <Button component={Link} to={`/movie/${movie.id}`} fullWidth>
          View Details
        </Button>
        <Button onClick={() => toggleFavorite(movie)} fullWidth>
          {favorite ? "♥ Remove Favorite" : "♡ Add Favorite"}
        </Button>
      </CardContent>
    </Card>
  );
}
