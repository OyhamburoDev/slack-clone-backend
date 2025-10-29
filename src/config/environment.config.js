import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const ENVIRONMENT = {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default ENVIRONMENT;
