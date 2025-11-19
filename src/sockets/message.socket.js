import ChannelMessageRepository from "../repositories/ChannelMessage.repository.js";
import ChannelRepository from "../repositories/Channel.repository.js";
import MemberWorkspaceRepository from "../repositories/MemberWorkspace.repository.js";
import ChannelMessages from "../models/ChannelMessage.model.js";
import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";

export function setupMessageSocket(io) {
  io.on("connection", async (socket) => {
    // ========== Verificar token JWT ==========
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("❌ Sin token, desconectando...");
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
      socket.user_id = decoded.id;
    } catch (error) {
      console.log("❌ Token inválido, desconectando...");
      socket.disconnect();
      return;
    }

    // ========== Unirse a un canal ==========
    socket.on("join_channel", (channel_id) => {
      socket.join(channel_id);
    });

    // ========== Salir de un canal ==========
    socket.on("leave_channel", () => {
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    });

    // ========== Enviar mensaje ==========
    socket.on("send_message", async (data) => {
      try {
        const { channel_id, content } = data;
        const user_id = socket.user_id;

        const channel = await ChannelRepository.getById(channel_id);

        const member =
          await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
            user_id,
            channel.workspace.toString()
          );

        if (!member) {
          socket.emit("error", {
            message: "No eres miembro de este workspace",
          });
          return;
        }

        const member_id = member._id;

        const newMessage = await ChannelMessageRepository.create(
          member_id,
          channel_id,
          content
        );

        await ChannelRepository.updateById(channel_id, {
          lastMessageAt: newMessage.created_at,
        });

        const populatedMessage = await ChannelMessages.findById(
          newMessage._id
        ).populate({
          path: "member",
          populate: {
            path: "user",
          },
        });

        io.to(channel_id).emit("new_message", populatedMessage);
      } catch (error) {
        console.error("❌ Error al enviar mensaje:", error);
        socket.emit("error", { message: "Error al enviar mensaje" });
      }
    });

    // ========== Desconexión ==========
    socket.on("disconnect", () => {
      console.log("❌ Usuario desconectado:", socket.id);
    });
  });
}
