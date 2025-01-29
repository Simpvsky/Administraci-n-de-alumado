import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setError("Credenciales inválidas.");
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 5000);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1C2833", // Color de fondo cambiado
      }}
    >
      <Box
        sx={{
          width: "380px",
          padding: 4,
          borderRadius: 3,
          backgroundColor: "rgba(44, 62, 80, 0.9)", // Azul grisáceo translúcido
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#ffffff", fontWeight: "bold" }}
        >
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: "#ffb74d" }} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#ffffff",
                borderRadius: 4,
              },
            }}
          />
          <TextField
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#ffb74d" }} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: "#ffffff",
                borderRadius: 4,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#0c3c78",
              "&:hover": { backgroundColor: "#092c5c" },
              color: "#ffffff",
              marginTop: 2,
              borderRadius: 4,
              padding: "10px 0",
              fontWeight: "bold",
            }}
          >
            Iniciar Sesión
          </Button>

          <Typography
            sx={{
              color: "#ffffff",
              marginTop: 2,
              textDecoration: "underline",
              cursor: "pointer",
            }}
             >
          </Typography>
        </form>
      </Box>

      {/* Pop-up de error */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
