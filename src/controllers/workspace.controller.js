import WorkspaceRepository from "../repositories/Workspace.repository.js";

class WorkspaceController {
  /* Crear un espacio de trabajo; */
  static async create(request, response) {
    try {
      const { name, url_image } = request.body;

      await WorkspaceRepository.create(name, url_image);
      response.json({
        ok: true,
        message: "Workspace creado exitosamente!",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Traer todos los workpsace */
  static async getAll(request, response) {
    try {
      const workspaces = await WorkspaceRepository.getAll();

      response.json({
        ok: true,
        message: "Workspaces obtenidos exitosamente",
        data: {
          workspaces: workspaces,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Traer por ID */
  static async getById(request, response) {
    try {
      const { workspace_id } = request.params;
      const workspace = await WorkspaceRepository.getById(workspace_id);

      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }

      response.json({
        ok: true,
        message: "Workspace obtenido con exito",
        data: {
          workspace: workspace,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Eliminar por ID */
  static async deleteById(request, response) {
    try {
      const { workspace_id } = request.params;

      //Primero verificar si existe
      const workspace = await WorkspaceRepository.getById(workspace_id);

      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }
      // Si existe eliminalo
      await WorkspaceRepository.deleteById(workspace_id);

      response.json({
        ok: true,
        message: "Workspace eliminado con éxito",
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }

  /* Actualizar por ID */
  static async updateById(request, response) {
    try {
      const { workspace_id } = request.params;
      const new_values = request.body;

      const workspace = await WorkspaceRepository.getById(workspace_id);
      if (!workspace) {
        return response.json({
          ok: false,
          message: "Workspace no encontrado",
        });
      }

      const new_workspace = await WorkspaceRepository.updateById(
        workspace_id,
        new_values
      );

      response.json({
        ok: true,
        message: "Workspace actualizado con exito",
        data: {
          workspace: new_workspace,
        },
      });
    } catch (error) {
      response.json({
        ok: false,
        message: error.message,
      });
    }
  }
}

export default WorkspaceController;
