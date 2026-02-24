import { Server } from "socket.io";

let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ================= USER JOIN =================
    socket.on("join", (userId) => {
      if (!userId) return;

      onlineUsers.set(userId, socket.id);

      console.log("Online Users:", Array.from(onlineUsers.keys()));

      // Send updated online list to all clients
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("Socket disconnected:", socket.id);
    });
  });
};

export { io, onlineUsers };
