import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

/* Conectar a la base de datos */

const connectMongoDB = async () => {
  try {
    await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING);
    console.log("Conexión exitosa a mongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); // detiene la aplicacion si no puede conectar
  }
};

export default connectMongoDB;
