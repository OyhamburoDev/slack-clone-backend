import Channels from "../models/Channel.model.js";

class ChannelRepository {
  /* Crear un canal */
  static async create(name, is_private, workspace_id) {
    const new_channel = new Channels({
      name,
      private: is_private,
      workspace: workspace_id,
    });
    await new_channel.save();
    return new_channel;
  }

  /* Traer todos los canales de un workspace */
  static async getAllByWorkspace(workspace_id) {
    return await Channels.find({ workspace: workspace_id });
  }

  /* Traer un canal por id */
  static async getById(channel_id) {
    return await Channels.findById(channel_id);
  }

  /* Eliminar un canal */
}

export default ChannelRepository;
