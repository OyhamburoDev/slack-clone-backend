import ENVIRONMENT from "../config/environment.config.js";
import UserRepository from "../repositories/User.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import transporter from "../config/nodemailer.config.js";
import resend from "../config/resend.config.js";

class AuthService {
  static async register(name, email, password) {
    /* Revisar si el email está en uso */
    const user_found = await UserRepository.getByEmail(email);
    if (user_found) {
      throw new ServerError(400, "Email ya en uso");
    }

    /* Hashear la contraseña */
    const password_hashed = await bcrypt.hash(password, 12);

    /* Crear usuario */
    const user_created = await UserRepository.create(
      name,
      email,
      password_hashed
    );

    /* Crear token */
    const verification_token = jwt.sign(
      {
        email: email,
        user_id: user_created._id,
      },
      ENVIRONMENT.JWT_SECRET
    );

    console.log("🔍 Intentando enviar email a:", email);
    console.log("🔍 Configuración SMTP:", {
      host: "smtp.gmail.com",
      port: 587,
      user: ENVIRONMENT.GMAIL_USERNAME,
    });

    await resend.emails.send({
      from: "Slack Clone <onboarding@resend.dev>",
      to: email,
      subject: "Verificación de correo electrónico",
      html: `
    <h1>Verificá tu email</h1>
    <p>Hacé click en el siguiente enlace para verificar tu cuenta:</p>
    <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Verificar email</a>
  `,
    });

    console.log("✅ Email enviado exitosamente");

    return true;
  }

  static async verifyEmail(verification_token) {
    try {
      /* Verificar que el token sea válido */
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET);

      /* Actualizar el usuario (marcar email como verificado) */
      await UserRepository.updateById(payload.user_id, {
        verified_email: true,
      });

      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ServerError(400, "Token inválido");
      }
      throw error;
    }
  }

  static async login(email, password) {
    /* 
    Buscar por email y guardar en una variable
    - No se encontro: Tiramos un error 404 'Email no registrado' / 'El email o la contraseña son invalidos'
    -Usamos bcrypt para chequear la password.
    -En caso de que no sean iguales: 401 contraseña invalida / 'El email o la contraseña son invalidos'
    -Generar el authorization_token con los datos que consideremos importantes para una sesion: (name, email, rol, created_at)
    No pasamos datos SENSIBLES.
    retornar el token
    */

    const user = await UserRepository.getByEmail(email);
    if (!user) {
      throw new ServerError(404, "Email no registrado");
    }
    if (user.verified_email === false) {
      throw new ServerError(401, "Email no verificado");
    }

    /* Permite saber si cierto valor es igual a otro cierto valor encriptado */
    const is_same_password = await bcrypt.compare(password, user.password);
    if (!is_same_password) {
      throw new ServerError(401, "Contraseña incorrecta");
    }

    const authorization_token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        role: "user",
      },
      ENVIRONMENT.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return {
      authorization_token,
    };
  }
}

export default AuthService;
