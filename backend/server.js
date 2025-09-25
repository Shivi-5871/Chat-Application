// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const notificationRoutes = require("./routes/notification.js")


dotenv.config();
const app = express();
app.use(express.json());


connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on('setup', (userData) => {
       socket.join(userData._id);
       console.log(userData._id);
       socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('Room Joined: ' + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return console.log('chat.users not defined');
        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message received', newMessageRecieved);
        })
    })

    socket.off('setup', () => {
        console.log('Disconnected from socket.io');
        socket.leave(userData._id);
    })
});


app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);  
app.use('/api/message', messageRoutes);  
app.use('/api/notification', notificationRoutes);

app.use(notFound);
app.use(errorHandler);
