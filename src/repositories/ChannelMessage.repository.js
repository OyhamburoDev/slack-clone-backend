import ChannelMessages from "../models/ChannelMessage.model.js";
import ChannelRepository from "./Channel.repository.js";

class ChannelMessageRepository {
  /* Crear un mensaje */
  static async create(member_id, channel_id, content) {
    const new_message = new ChannelMessages({
      member: member_id,
      channel: channel_id,
      content: content,
    });
    await new_message.save();

    await ChannelRepository.updateById(channel_id, {
      lastMessageAt: new_message.created_at,
    });

    return new_message;
  }

  /* Obtener todos los mensajes de un canal */
  static async getAllByChannelId(channel_id) {
    const messages = await ChannelMessages.find({ channel: channel_id })
      .populate({
        path: "member",
        populate: {
          path: "user",
        },
      })
      .sort({ created_at: 1 });
    return messages;
  }

  // Escapar caracteres especiales de regex
  static escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Buscar en mi workspace */
  static async searchByWorkspace(workspace_id, query) {
    const safeQuery = this.escapeRegex(query);
    const messages = await ChannelMessages.find({
      content: { $regex: safeQuery, $options: "i" },
    })
      .populate({
        path: "channel",
        match: { workspace: workspace_id },
        select: "name",
      })
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ created_at: -1 })
      .limit(20);

    return messages.filter((msg) => msg.channel !== null);
  }
}

export default ChannelMessageRepository;
