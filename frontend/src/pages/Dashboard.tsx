import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/students")}>
          Administrar Alumnos
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate("/grades")}>
          Administrar Calificaciones
        </Button>
        <Button variant="contained" color="success" onClick={() => navigate("/teachers")}>
          Información de Profesores
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
