import Users from "../models/User.model.js";

class UserRepository {
  /* Crear un nuevo usuario */
  static async create(name, email, password) {
    const result = await Users.insertOne({
      name: name,
      email: email,
      password: password,
    });
    return result;
  }

  /* Traer todos los usuarios */
  static async getAll() {
    const users_get = await Users.find();
    return users_get;
  }

  /* Obtener un usuario por ID */
  static async getById(user_id) {
    const user_found = await Users.findById(user_id);
    return user_found;
  }

  /* Obtener usuario por email */
  static async getByEmail(email) {
    const user = await Users.findOne({ email: email });
    return user;
  }

  /* Actualizar usuario por ID */
  static async updateById(user_id, new_values) {
    const user_updated = await Users.findByIdAndUpdate(user_id, new_values, {
      new: true, // Cuando se haga la actualización nos traiga el objeto actualizado
    });
    return user_updated;
  }

  /* Eliminar por ID */
  static async deleteById(user_id) {
    await Users.findByIdAndDelete(user_id);
    return true;
  }
}

export default UserRepository;
