import WorkspaceRepository from "../repositories/Workspace.repository.js";
import MemberWorkspaceRepository from "../repositories/MemberWorkspace.repository.js";
import { ServerError } from "../utils/customError.utils.js";

function workspaceMiddleware(valid_member_roles = []) {
  return async function (request, response, next) {
    try {
      const user = request.user;
      const { workspace_id } = request.params;

      // Verificar que el workspace existe
      const workspace = await WorkspaceRepository.getById(workspace_id);
      if (!workspace) {
        throw new ServerError(404, "Workspace no encontrado");
      }

      // Verificar que el usuario es miembro del workspace
      const member =
        await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
          user.id,
          workspace_id
        );

      if (!member) {
        throw new ServerError(403, "No eres miembro de este workspace");
      }

      // Verificar roles si se especificaron
      if (
        valid_member_roles.length > 0 &&
        !valid_member_roles.includes(member.role)
      ) {
        throw new ServerError(403, "No tienes permisos suficientes");
      }

      // Guardar datos para usar en el controlador
      request.workspace = workspace;
      request.member = member;

      next();
    } catch (error) {
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          message: error.message,
        });
      }
      return response.status(500).json({
        ok: false,
        message: "Error interno del servidor",
      });
    }
  };
}

export default workspaceMiddleware;
