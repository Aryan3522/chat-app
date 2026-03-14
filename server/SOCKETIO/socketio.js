const { Server } = require('socket.io');
const http = require('http')
const express = require("express")
const dotenv = require("dotenv")
dotenv.config({path:"./Config/config.env"})

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:process.env.CORS_PORT || "http://localhost:3000",
        methods: ["GET", "POST","PUT"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
});


const getReceiverSocketId = (receiverId) => {
    return users[receiverId];
  };
  

const users = {};


io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    users[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

module.exports ={ app, io, server ,getReceiverSocketId};