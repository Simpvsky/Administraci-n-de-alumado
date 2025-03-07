"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// ✅ Middleware para evitar conflicto de CORS y asegurar credenciales
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true // Permite envío de cookies en las solicitudes
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const USERS = [{ username: "admin", password: "12345" }];
// ✅ Generar token JWT
const generateToken = (username) => {
    return jsonwebtoken_1.default.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
};
// ✅ Middleware para verificar token
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Inicia sesión primero." });
    }
    try {
        req.user = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Sesión inválida o expirada." });
    }
};
// ✅ Login: Genera y almacena token en cookie
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
    }
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }
    const token = generateToken(username);
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // ⚠️ Cambiar a true si usas HTTPS
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Login exitoso" });
});
// ✅ Logout: Elimina la cookie del cliente
app.post("/api/logout", (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout exitoso" });
});
// ✅ Ruta protegida
app.get("/api/protected", verifyToken, (req, res) => {
    var _a;
    const username = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.username) || "Usuario desconocido";
    return res.status(200).json({ message: `Hola, ${username}! Accediste a una ruta protegida.` });
});
// ✅ Ruta para registrar alumnos (protegida)
app.post("/api/alumnos", verifyToken, (req, res) => {
    const { nombre, edad, curso } = req.body;
    if (!nombre || !edad || !curso) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }
    return res.status(201).json({ message: "Alumno registrado correctamente." });
});
// ✅ Verificar que el puerto no esté en uso antes de iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
}).on("error", (err) => {
    if (err.message.includes("EADDRINUSE")) {
        console.error(`⚠️ El puerto ${PORT} ya está en uso. Intenta con otro puerto.`);
    }
    else {
        console.error("❌ Error al iniciar el servidor:", err);
    }
});
