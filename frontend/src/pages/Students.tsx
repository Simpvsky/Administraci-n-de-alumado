import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

interface Student {
  id: number;
  name: string;
  age: number;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await axios.get("http://localhost:4000/api/students");
      setStudents(response.data);
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (!name || !age) return alert("Todos los campos son obligatorios.");
    const response = await axios.post("http://localhost:4000/api/students", { name, age });
    setStudents([...students, response.data]);
    setName("");
    setAge("");
  };

  const handleDeleteStudent = async (id: number) => {
    await axios.delete(`http://localhost:4000/api/students/${id}`);
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Administrar Alumnos
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Edad"
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleAddStudent}>
          Agregar
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Edad</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.age}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDeleteStudent(student.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Students;
