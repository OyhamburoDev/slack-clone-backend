import ChannelRepository from "../repositories/Channel.repository.js";

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
}

export default ChannelController;
