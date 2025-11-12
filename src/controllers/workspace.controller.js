import WorkspaceRepository from "../repositories/Workspace.repository.js";
import MemberWorkspaceRepository from "../repositories/MemberWorkspace.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import ENVIRONMENT from "../config/environment.config.js";
import UserRepository from "../repositories/User.repository.js";
import transporter from "../config/nodemailer.config.js";
import jwt from "jsonwebtoken";
import ROLES from "../constants/roles.js";

class WorkspaceController {
  /* Crear un espacio de trabajo; */
  static async create(request, response) {
    try {
      const { name, url_image } = request.body;
      const user_id = request.user.id;

      const workspace_id = await WorkspaceRepository.create(name, url_image);
      await MemberWorkspaceRepository.create(
        user_id,
        workspace_id,
        ROLES.ADMIN
      );
      console.log("=== MIEMBRO CREADO ===");
      console.log("user_id:", user_id);
      console.log("workspace_id:", workspace_id);

      const workspace = await WorkspaceRepository.getById(workspace_id);

      response.json({
        ok: true,
        message: "Workspace creado exitosamente!",
        data: {
          workspace: workspace,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Traer todos los workpsace */
  static async getAll(request, response) {
    try {
      const user_id = request.user.id;
      const workspaces =
        await MemberWorkspaceRepository.getAllWorkspacesByUserId(user_id);

      response.json({
        ok: true,
        message: "Workspaces obtenidos exitosamente",
        data: {
          workspaces: workspaces,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Traer por ID */
  static async getById(request, response) {
    try {
      const { workspace_id } = request.params;
      const workspace = await WorkspaceRepository.getById(workspace_id);

      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }

      response.json({
        ok: true,
        message: "Workspace obtenido con exito",
        data: {
          workspace: workspace,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Eliminar por ID */
  static async deleteById(request, response) {
    try {
      const { workspace_id } = request.params;

      //Primero verificar si existe
      const workspace = await WorkspaceRepository.getById(workspace_id);

      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }
      // Si existe eliminalo
      await WorkspaceRepository.deleteById(workspace_id);

      response.json({
        ok: true,
        message: "Workspace eliminado con éxito",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Actualizar por ID */
  static async updateById(request, response) {
    try {
      const { workspace_id } = request.params;
      const new_values = request.body;

      const workspace = await WorkspaceRepository.getById(workspace_id);
      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }

      const new_workspace = await WorkspaceRepository.updateById(
        workspace_id,
        new_values
      );

      response.json({
        ok: true,
        message: "Workspace actualizado con exito",
        data: {
          workspace: new_workspace,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  static async inviteMember(request, response) {
    try {
      const { workspace_id } = request.params;
      const { invited_email } = request.body;
      const user_id = request.user.id;

      // Verificar que el workspace existe
      const workspace = await WorkspaceRepository.getById(workspace_id);
      if (!workspace) {
        throw new ServerError(404, "Workspace no encontrado");
      }

      //Buscar al usuario invitado
      const user_invited = await UserRepository.getByEmail(invited_email);
      if (!user_invited) {
        throw new ServerError(404, "Usuario no encontrado");
      }

      //Verificar que No es miembro ya
      const member_data =
        await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
          user_invited._id,
          workspace_id
        );
      if (member_data) {
        throw new ServerError(409, "Usuario ya es miembro del workspace");
      }

      // Crear token de invitacion
      const invite_token = jwt.sign(
        {
          id_invited: user_invited._id,
          email_invited: invited_email,
          id_workspace: workspace_id,
          id_inviter: user_id,
        },
        ENVIRONMENT.JWT_SECRET,
        { expiresIn: "7d" }
      );

      await transporter.sendMail({
        from: ENVIRONMENT.GMAIL_USERNAME,
        to: invited_email,
        subject: "Invitación al workspace",
        html: `
    <h1>Has sido invitado al workspace ${workspace.name}</h1>
    <p>Haz click en el siguiente enlace para aceptar la invitación:</p>
    <a href="${ENVIRONMENT.URL_API_BACKEND}/api/members/confirm-invitation/${invite_token}">
      Aceptar invitación
    </a>
  `,
      });

      response.json({
        ok: true,
        message: "Usuario invitado exitosamente",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }
}

export default WorkspaceController;
