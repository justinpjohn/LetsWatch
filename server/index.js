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
    
    socket.on('sync', ({roomName, posUser, pos}) => {
        console.log('Server received sync');
        io.to(roomName).emit('sync', {posUser, pos});
    });
    
    socket.on('pauseSync', ({roomName, posUser, pos}) => {
        console.log('Server received pauseSync');
        socket.to(roomName).emit('pauseSync', {posUser});
    });
    
    socket.on('playSync', ({roomName, posUser, pos}) => {
        console.log('Server received playSync');
        io.to(roomName).emit('playSync', {posUser});
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

