const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const UserRegisterRoutes = require('./routes/userRegisterRoute.js');
const RoomRoute = require('./routes/RoomRoute.js');
const chatRoute = require('./routes/chatRoute.js');
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require('path');
const socketAuth = require('./middleware/SocketAuth.js');
const createMessageModel = require('./models/Message.js');
require('dotenv').config()

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected!"))
  .catch(err => console.log("Error in mongo connection ->", err));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "https://chathub-silk.vercel.app/",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use("/register", UserRegisterRoutes);
app.use('/user', chatRoute);
app.use('/room', RoomRoute);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

app.use(express.static(path.resolve('./public')));
app.get('/', (req, res) => {
  return res.sendFile('/public/index.html');
});

io.use(socketAuth);

const usersInRooms = {};

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, username }) => {
    socket.join(roomId);
    socket.username = username;
    socket.roomId = roomId; 

    if (!usersInRooms[roomId]) {
      usersInRooms[roomId] = [];
    }
    
    if (!usersInRooms[roomId].includes(username)) {
      usersInRooms[roomId].push(username);
    }

    socket.to(roomId).emit('userJoined', username);
    io.to(roomId).emit('updateUserList', usersInRooms[roomId]);

    const MessageModel = createMessageModel(roomId);

    const previousMessages = await MessageModel.find({ roomId }).sort({ timestamp: 1 });
    socket.emit('previousMessages', previousMessages);
  });

  socket.on('sendMessage',async  ({ roomId, message }) => {

    const MessageModel = createMessageModel(roomId);

    const newMessage = new MessageModel({
      roomId,
      username: socket.username,
      message
    });
    await newMessage.save();

    io.to(roomId).emit('receiveMessage', { username: socket.username, message });
  });

  socket.on('disconnect', () => {
    const { roomId, username } = socket;
    if (usersInRooms[roomId]) {
      usersInRooms[roomId] = usersInRooms[roomId].filter(user => user !== username);
      if (usersInRooms[roomId].length === 0) {
        delete usersInRooms[roomId];
      }
      socket.to(roomId).emit('userLeft', username);
      io.to(roomId).emit('updateUserList', usersInRooms[roomId]); 
    }
  });
});


httpServer.listen(process.env.PORT, () => {
  console.log("Server started on port " , process.env.PORT);
});
