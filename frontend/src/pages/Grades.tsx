import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface Grade {
  id: number;
  student_id: number;
  subject: string;
  grade: number;
}

const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [studentId, setStudentId] = useState<number | "">("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState<number | "">("");

  useEffect(() => {
    const fetchGrades = async () => {
      const response = await axios.get("http://localhost:4000/api/grades");
      setGrades(response.data);
    };
    fetchGrades();
  }, []);

  const handleAddGrade = async () => {
    if (!studentId || !subject || !grade) return alert("Todos los campos son obligatorios.");
    const response = await axios.post("http://localhost:4000/api/grades", { studentId, subject, grade });
    setGrades([...grades, response.data]);
    setStudentId("");
    setSubject("");
    setGrade("");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administrar Calificaciones
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="ID Alumno"
          type="number"
          value={studentId}
          onChange={(e) => setStudentId(Number(e.target.value))}
        />
        <TextField
          label="Materia"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          label="Calificación"
          type="number"
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleAddGrade}>
          Agregar
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Alumno</TableCell>
            <TableCell>Materia</TableCell>
            <TableCell>Calificación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.map((g) => (
            <TableRow key={g.id}>
              <TableCell>{g.student_id}</TableCell>
              <TableCell>{g.subject}</TableCell>
              <TableCell>{g.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Grades;
