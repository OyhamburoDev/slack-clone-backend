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
}

export default ChannelMessageController;
