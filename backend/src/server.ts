import express, { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Usuarios con contraseña encriptada
const USERS = [{ 
  username: "admin", 
  password: bcrypt.hashSync("12345", 10)
}];

// Interfaz para manejar req.user
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

// Generar token JWT
const generateToken = (username: string): string => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
};

// Middleware para verificar token
const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Inicia sesión primero." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesión inválida o expirada." });
  }
};

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
  }

  const user = USERS.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = generateToken(username);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Login exitoso", token });
});

// Logout
app.post("/api/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout exitoso" });
});

// Ruta protegida
app.get("/api/protected", verifyToken, (req: AuthenticatedRequest, res: Response) => {
  const username = (req.user as JwtPayload)?.username || "Usuario desconocido";
  return res.status(200).json({ message: `Hola, ${username}! Accediste a una ruta protegida.` });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});