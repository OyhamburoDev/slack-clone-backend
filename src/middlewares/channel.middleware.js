import ChannelRepository from "../repositories/Channel.repository.js";

async function channelMiddleware(request, response, next) {
  try {
    const { workspace_id, channel_id } = request.params;

    const channel_selected = await ChannelRepository.getByIdAndWorkspaceId(
      workspace_id,
      channel_id
    );

    if (!channel_selected) {
      return response.status(400).json({
        ok: false,
        message: "Canal no encontrado o no perteneces al workspace",
      });
    }

    request.channel_selected = channel_selected;
    next();
  } catch (error) {
    console.log("Error en channelMiddleware:", error);
    response.status(500).json({
      ok: false,
      mesage: "Error interno del servidor",
    });
  }
}

export default channelMiddleware;
