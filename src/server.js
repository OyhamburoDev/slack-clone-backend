import express from "express";
import cors from "cors";
import connectMongoDB from "./config/mongoDB.config.js";
import auth_router from "./routes/auth.route.js";
import workspace_router from "./routes/workspace.route.js";
import channel_router from "./routes/channel.route.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import member_router from "./routes/member.route.js";
import channelMessage_router from "./routes/messageChannel.route.js";

/* Conectar a MongoDB */
connectMongoDB();

/* Crear la aplicación de Express */
const app = express();

/* Middlewares */
app.use(
  cors({
    origin: [process.env.URL_FRONTEND, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json()); // Para que Express entienda JSON en el body

/* Conectar el router */
app.use("/api/auth", auth_router);
app.use("/api/workspace", authMiddleware, workspace_router);
app.use("/api/members", member_router);
app.use("/api/workspace", authMiddleware, channel_router);
app.use("/api/workspace", authMiddleware, channelMessage_router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
