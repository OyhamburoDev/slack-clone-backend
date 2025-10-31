import express from "express";
import cors from "cors";
import connectMongoDB from "./config/mongoDB.config.js";
import WorkspaceRepository from "./repositories/Workspace.repository.js";
import workspace_router from "./routes/workspace.route.js";

/* Conectar a MongoDB */
connectMongoDB();

/* Crear la aplicación de Express */
const app = express();

/* Middlewares */
app.use(cors()); // Permitir requests desde el frontend
app.use(express.json()); // Para que Express entienda JSON en el body

/* Conectar el router */
app.use("/api/workspace", workspace_router);

/* Levantar el servidor en el puerto 8080 */
app.listen(8080, () => {
  console.log("Servidor corriendo en http://localhost:8080");
});
