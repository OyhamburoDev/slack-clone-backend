import nodemailer from "nodemailer";
import ENVIRONMENT from "./environment.config.js";

/* Configuración del transporter */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: ENVIRONMENT.GMAIL_USERNAME,
    pass: ENVIRONMENT.GMAIL_PASSWORD,
  },
});

export default transporter;
