import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para parsear JSON
app.use(express.json());

// Credenciales simuladas (almacenadas en el código para pruebas)
const USERS = [
  { username: "admin", password: "12345" }, // Usuario de prueba
];

// Definir una interfaz para extender el objeto Request
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload; // Aquí indicamos que `user` es opcional
}

// Generar token JWT
const generateToken = (username: string): string => {
  return jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Middleware para verificar el token
const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as string | JwtPayload;
    req.user = decoded; // Asignamos el token decodificado al objeto `req.user`
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// Ruta de login (sin base de datos)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Datos recibidos del frontend:", username, password); // Debug

  const USERS = [
    { username: "admin", password: "12345" },
  ];

  const user = USERS.find((u) => u.username === username && u.password === password);

  console.log("Usuario encontrado:", user); // Debug

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  res.status(200).json({ token });
});

// Ruta protegida (requiere autenticación)
app.get("/api/protected", verifyToken, (req: AuthenticatedRequest, res: Response): void => {
  const username = (req.user as JwtPayload)?.username; // Extraer el nombre de usuario del token decodificado
  res.status(200).json({ message: `Hola, ${username}! Accediste a una ruta protegida.` });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
