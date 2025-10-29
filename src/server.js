import express from "express";
import cors from "cors";
import connectMongoDB from "./config/mongoDB.config.js";

/* Conectar a MongoDB */
connectMongoDB();

/* Crear la aplicación de Express */
const app = express();

/* Middlewares */
app.use(cors()); // Permitir requests desde el frontend
app.use(express.json()); // Para que Express entienda JSON en el body

/* Crear ruta de prueba */
app.get("/", (request, response) => {
  response.send("¡Servidor funcionando!");
});

app.get("/status", (request, response) => {
  response.json({
    ok: true,
    message: "Servidor funcionando correctamente",
  });
});

/* Levantar el servidor en el puerto 8080 */
app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});
