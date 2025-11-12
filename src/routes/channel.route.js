import express from "express";
import ChannelController from "../controllers/channel.controller.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";

/* Crear el router */
const channel_router = express.Router();

/* Definir las rutas */

channel_router.post(
  "/:workspace_id/channels",
  workspaceMiddleware(),
  ChannelController.create
);
channel_router.get(
  "/:workspace_id/channels",
  workspaceMiddleware(),
  ChannelController.getAllByWorkspace
);

channel_router.delete(
  "/:workspace_id/channels/:channel_id",
  workspaceMiddleware(),
  ChannelController.deleteChannel
);

export default channel_router;
