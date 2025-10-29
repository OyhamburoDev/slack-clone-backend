import Workspaces from "../models/Workspace.model.js";

class WorkspaceRepository {
  /* Crear un Workspace */
  static async create(name, url_image) {
    await Workspaces.insertOne({
      name: name,
      url_image: url_image,
    });
    return true;
  }

  /* Traer todos los Workpasces */
  static async getAll() {
    const workspaces_get = await Workspaces.find();
    return workspaces_get;
  }

  /* Obtener un Workpasce por ID */
  static async getById(workspace_id) {
    const workspace_found = await Workspaces.findById(workspace_id);
    return workspace_found;
  }

  /* Eliminar por ID */
  static async deleteById(workspace_id) {
    await Workspaces.deleteById(workspace_id);
    return true;
  }

  /* Actualizar workspace por ID */
  static async updateById(workspace_id, new_value) {
    const workspace_update = await Workspaces.findByIdAndUpdate(
      workspace_id,
      new_value,
      {
        new: true,
      }
    );
    return workspace_update;
  }
}

export default WorkspaceRepository;
