import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";
import ROLES from "../constants/roles.js";

/* Crear el router */
const workspace_router = express.Router();

/* Definir las rutas */
workspace_router.get("/", WorkspaceController.getAll);
workspace_router.get(
  "/:workspace_id",
  workspaceMiddleware(),
  WorkspaceController.getById
);
workspace_router.post(
  "/:workspace_id/invite",
  workspaceMiddleware([ROLES.ADMIN]),
  WorkspaceController.inviteMember
);
workspace_router.post("/", WorkspaceController.create);
workspace_router.put(
  "/:workspace_id",
  workspaceMiddleware([ROLES.ADMIN]),
  WorkspaceController.updateById
);
workspace_router.delete(
  "/:workspace_id",
  workspaceMiddleware([ROLES.ADMIN]),
  WorkspaceController.deleteById
);

export default workspace_router;
