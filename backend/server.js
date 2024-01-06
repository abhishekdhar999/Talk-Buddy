const express = require("express");
const connectDB = require("./config/db");
// const dotenv = require("dotenv");
const cors = require('cors')
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

// dotenv.config();
connectDB();
const app = express();

// app.listen(5000,console.log("server started at port 3000"))
app.use(express.json()); // to accept json data
app.use(cors())

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = 6003;

const server = app.listen(
  PORT,
  ()=>{
    console.log(`server started on port ${PORT}` )
  }
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
    methods:["GET","POST"]
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
// video calling

socket.emit("me",socket.id);
socket.on("disconnect",()=>{
  socket.broadcast.emit("callEnded")
});

socket.on("callUser",({userToCall,signalData,from,name})=>{
  io.to(userToCall).emit("callUser",{signalData,from,name});
});

socket.on("answerCall",(data) => {
  io.to(data.to).emit("callAccepted",data.signal)
});
  
  // messages
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});