const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// const PORT = process.env.PORT || 8081;
const PORT = 8081;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {
    console.log('A user has connected.');
    
    socket.on('room connection', ({roomName, user}) => {
        console.log(`${user} has joined ${roomName}`);
        socket.join(roomName);
        socket.to(roomName).emit('room connection', `${user} has joined the party! Say hi!`);
    });
    
    socket.on('chat message', ({roomName, msg}) => {
        console.log(`received: ${msg} from ${roomName}`);
        io.to(roomName).emit('chat message', msg); 
    });
    
    socket.on('disconnect', () => {
        console.log('A user has disconnected.'); 
    });
});


app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

