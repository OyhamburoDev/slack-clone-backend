import MemberWorkspaces from "../models/MemberWorkspace.model.js";
import { ServerError } from "../utils/customError.utils.js";

class MemberWorkspaceRepository {
  /* Traer los workspace de un usuario */
  static async getAllWorkspacesByUserId(user_id) {
    //Traer todos los workspace de los que soy miembro
    const workspace_que_soy_miembro = await MemberWorkspaces.find({
      user: user_id,
    }).populate({
      path: "workspace",
      match: { active: true },
    });
    return workspace_que_soy_miembro;
  }

  /* Verificar si un usuario ya es miembro de un workspace */
  static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id) {
    const member_workspace = await MemberWorkspaces.findOne({
      user: user_id,
      workspace: workspace_id,
    });
    return member_workspace;
  }

  /* Crear relacion usuario workspace */
  static async create(user_id, workspace_id, role = "member") {
    const member =
      await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
        user_id,
        workspace_id
      );
    if (member) {
      throw new ServerError(400, "El usuario ya es miembro del workspace");
    }
    await MemberWorkspaces.insertOne({
      user: user_id,
      workspace: workspace_id,
      role: role,
    });
  }
}

export default MemberWorkspaceRepository;
