"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware para parsear JSON
app.use(express_1.default.json());
// Credenciales simuladas (almacenadas en el código para pruebas)
const USERS = [
    { username: "admin", password: "12345" }, // Usuario de prueba
];
// Generar token JWT
const generateToken = (username) => {
    return jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
// Middleware para verificar el token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Token inválido o expirado" });
        return;
    }
};
// Ruta de login (sin base de datos)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    // Verificar las credenciales
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
    }
    // Generar y devolver el token
    const token = generateToken(username);
    res.status(200).json({ token });
});
// Ruta protegida (requiere autenticación)
app.get("/api/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: `Hola, ${req.user.username}! Accediste a una ruta protegida.` });
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
