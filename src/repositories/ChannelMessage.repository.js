import ChannelMessages from "../models/ChannelMessage.model";

class ChannelMessageRepository {
  /* Crear un mensaje */
  static async create(member_id, channel_id, content) {
    const new_message = new ChannelMessages({
      member: member_id,
      channel: channel_id,
      content: content,
    });
    await new_message.save();
    return new_message;
  }

  /* Obtener todos los mensajes de un canal */
  static async getAllByChannel(channel_id) {
    const messages = await ChannelMessages.find({ channel: channel_id })
      .populate("member")
      .sort({ created_at: 1 });
    return messages;
  }
}

export default ChannelMessageRepository;
