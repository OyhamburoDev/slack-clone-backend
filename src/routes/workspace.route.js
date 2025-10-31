import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";

/* Crear el router */
const workspace_router = express.Router();

/* Definir las rutas */
workspace_router.get("/", WorkspaceController.getAll);
workspace_router.get("/:workspace_id", WorkspaceController.getById);
workspace_router.post("/", WorkspaceController.create);
workspace_router.put("/:workspace_id", WorkspaceController.updateById);
workspace_router.delete("/:workspace_id", WorkspaceController.deleteById);

export default workspace_router;
