import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Base de datos simulada
const usuarios = [
  { id: 1, name: "Juan", age: 25, city: "Madrid" },
  { id: 2, name: "María", age: 30, city: "Barcelona" },
  { id: 3, name: "Pedro", age: 25, city: "Madrid" },
  { id: 4, name: "Ana", age: 22, city: "Valencia" },
];

// Ruta GET con múltiples filtros
// Ejemplo de query: /api/users?name=Juan&age=25&city=Madrid
app.get("/api/users", (req, res) => {
  let resultados = [...usuarios];

  // Aplicar filtros si existen
  const { name, age, city } = req.query;

  if (name) {
    resultados = resultados.filter((u) =>
      u.name.toLowerCase().includes(String(name).toLowerCase())
    );
  }

  if (age) {
    resultados = resultados.filter((u) => u.age === Number(age));
  }

  if (city) {
    resultados = resultados.filter(
      (u) => u.city.toLowerCase() === String(city).toLowerCase()
    );
  }

  res.json({
    filtros: req.query,
    resultados,
  });
});

// Ruta por ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find((u) => u.id === Number(id));
  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(usuario);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
