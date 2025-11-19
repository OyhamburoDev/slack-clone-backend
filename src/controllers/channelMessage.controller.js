import ChannelMessageRepository from "../repositories/ChannelMessage.repository.js";

class ChannelMessageController {
  static async create(request, response) {
    try {
      const { content } = request.body;
      const member_id = request.member._id;
      const { channel_id } = request.params;

      await ChannelMessageRepository.create(member_id, channel_id, content);
      response.json({
        ok: true,
        message: "Mensaje creado exitosamente",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  static async getAllByChannelId(request, response) {
    try {
      const { channel_id } = request.params;

      const messages = await ChannelMessageRepository.getAllByChannelId(
        channel_id
      );

      response.json({
        ok: true,
        data: {
          messages: messages,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  static async searchMessages(request, response) {
    try {
      const { workspace_id } = request.params;
      const { query } = request.query;

      if (!query || query.trim().length === 0) {
        return response.json({
          ok: true,
          data: { messages: [] },
        });
      }

      const messages = await ChannelMessageRepository.searchByWorkspace(
        workspace_id,
        query
      );

      response.json({
        ok: true,
        data: { messages },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }
}

export default ChannelMessageController;
