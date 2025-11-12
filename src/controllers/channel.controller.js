import { request } from "express";
import ChannelRepository from "../repositories/Channel.repository.js";
import MemberWorkspaceRepository from "../repositories/MemberWorkspace.repository.js";
import ROLES from "../constants/roles.js";

class ChannelController {
  static async create(request, response) {
    try {
      const { workspace_id } = request.params;
      const { name, is_private = false } = request.body;

      await ChannelRepository.create(name, is_private, workspace_id);
      response.json({
        ok: true,
        message: "Canal creado exitosamente!",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  static async getAllByWorkspace(request, response) {
    try {
      const { workspace_id } = request.params;

      const channels = await ChannelRepository.getAllByWorkspace(workspace_id);

      response.json({
        ok: true,
        data: {
          channels: channels,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  static async deleteChannel(request, response) {
    try {
      const { workspace_id, channel_id } = request.params;
      const user_id = request.user.id;

      const member =
        await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
          user_id,
          workspace_id
        );
      if (!member || member.role != ROLES.ADMIN) {
        return response.status(403).json({
          ok: false,
          message: "Solo los administradores pueden eliminar canales",
        });
      }

      await ChannelRepository.deleteById(channel_id);

      response.json({
        ok: true,
        message: "Canal eliminado exitosamente",
      });
    } catch (error) {
      response.status(500).json({
        ok: false,
        message: error.message,
      });
    }
  }
}

export default ChannelController;
