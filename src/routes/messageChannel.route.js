import express from "express";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import channelMiddleware from "../middlewares/channel.middleware.js";
import ChannelMessageController from "../controllers/channelMessage.controller.js";

/* crear router */

const channelMessage_router = express.Router();

/* Definir las rutas */

channelMessage_router.post(
  "/:workspace_id/channels/:channel_id/message",
  workspaceMiddleware(),
  channelMiddleware,
  ChannelMessageController.create
);
channelMessage_router.get(
  "/:workspace_id/channels/:channel_id/message",
  workspaceMiddleware(),
  channelMiddleware,
  ChannelMessageController.getAllByChannelId
);

export default channelMessage_router;
