import express from "express";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import ChannelMessageController from "../controllers/channelMessage.controller.js";

/* crear router */

const channelMessage_router = express.Router();

/* Definir las rutas */

channelMessage_router.post(
  "/:workspace_id/channels/:channel_id/message",
  workspaceMiddleware(),
  ChannelMessageController.create
);
channelMessage_router.get(
  "/:workspace_id/channels/:channel_id/message",
  workspaceMiddleware(),
  ChannelMessageController.getAllByChannelId
);

export default channelMessage_router;
