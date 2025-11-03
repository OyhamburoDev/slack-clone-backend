import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";
import MemberWorkspaceRepository from "../repositories/MemberWorkspace.repository.js";

class MemberController {
  static async confirmInvitation(request, response) {
    try {
      const { token } = request.params;

      const { id_invited, id_workspace } = jwt.verify(
        token,
        ENVIRONMENT.JWT_SECRET
      );

      await MemberWorkspaceRepository.create(
        id_invited,
        id_workspace,
        "member"
      );

      response.redirect(`${ENVIRONMENT.URL_FRONTEND}`);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        response.status(400).json({
          ok: false,
          message: "Token inválido",
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        response.status(400).json({
          ok: false,
          message: "Token expirado",
        });
      } else {
        response.status(500).json({
          ok: false,
          message: error.message,
        });
      }
    }
  }
}

export default MemberController;
