
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useMovies } from "../context/MovieContext";

export default function Navbar() {
  const { darkMode, setDarkMode, favorites } = useMovies();

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Movie Explorer
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/favorites">
          Favorites ({favorites.length})
        </Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
        <Button color="inherit" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "☾ Dark"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
