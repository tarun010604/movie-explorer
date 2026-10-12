
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, Typography } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim() || !password) return;
    sessionStorage.setItem("username", username.trim());
    navigate("/");
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth required label="Username"
          margin="normal" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth required label="Password" type="password"
          margin="normal" value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
          Continue
        </Button>
      </form>
    </Container>
  );
}
