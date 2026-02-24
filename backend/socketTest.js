import { io } from "socket.io-client";

const USER_ID = "699b18b4e501b31c40ff636d"; // change this

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected as:", socket.id);

  // Join with userId
  socket.emit("join", USER_ID);
});

socket.on("newMessage", (msg) => {
  console.log("🔥 New message received:");
  console.log(msg);
});