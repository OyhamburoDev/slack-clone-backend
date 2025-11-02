import express from "express";
import ChannelController from "../controllers/channel.controller.js";

/* Crear el router */
const channel_router = express.Router();

/* Definir las rutas */

channel_router.post("/:workspace_id/channels", ChannelController.create);
channel_router.get(
  "/:workspace_id/channels",
  ChannelController.getAllByWorkspace
);

export default channel_router;
