import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const ENVIRONMENT = {
  MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,
  JWT_SECRET: process.env.JWT_SECRET,
  URL_API_BACKEND: process.env.URL_API_BACKEND,
  URL_FRONTEND: process.env.URL_FRONTEND,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  GMAIL_USERNAME: process.env.GMAIL_USERNAME,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
};

export default ENVIRONMENT;
