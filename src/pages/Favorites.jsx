
import { Container, Typography, Box } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { useMovies } from "../context/MovieContext";

export default function Favorites() {
  const { favorites } = useMovies();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>My Favorites</Typography>
      {favorites.length === 0 ? (
        <Typography>No favorites yet. Add movies from Home.</Typography>
      ) : (
        <Box sx={{ display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,minmax(0,1fr))",
            sm: "repeat(3,minmax(0,1fr))",
            md: "repeat(4,minmax(0,1fr))"
          }, gap: 2 }}>
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Box>
      )}
    </Container>
  );
}
