const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 8081;
// const PORT = 8081

// const router = require('./router');

const INDEX = '../';

const app = express().use(express.static(__dirname + '/../build'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(path.resolve(INDEX), 'build', 'index.html'));
});


const server = http.Server(app);
const io = socketio(server);


io.on('connection', (socket) => {
    // console.log('A user has connected.');
    
    socket.on('room connection', ({roomName, user}) => {
        // console.log(`${user} has joined ${roomName}`);
        socket.join(roomName);
        socket.to(roomName).emit('room connection', `${user} has joined the party! Say hi!`);
        socket.emit('socket connection', 'socket connection successful');
    });
    
    socket.on('seekSync', ({roomName, reqUser, pos}) => {
        // console.log('Server received sync: ');
        io.to(roomName).emit('seekSync', {reqUser, pos});
    });
    
    socket.on('pauseSync', ({roomName, reqUser, pos}) => {
        // console.log('Server received pauseSync');
        socket.to(roomName).emit('pauseSync', {reqUser});
    });
    
    socket.on('playSync', ({roomName, reqUser, pos}) => {
        // console.log('Server received playSync');
        io.to(roomName).emit('playSync', {reqUser});
    });
    
    socket.on('chat message', ({roomName, socketID, user, msg}) => {
        // console.log(`received: ${msg} from ${roomName}`);
        io.to(roomName).emit('chat message', {sockID: socketID, user, msg}); 
    });
    
    socket.on('video select', ({roomName, user, videoId}) => {
        // console.log('Server received video select' + videoId);
        io.to(roomName).emit('video select', {user, videoId}); 
    });
    
    socket.on('disconnect', () => {
        // console.log('A user has disconnected.'); 
    });
});


// app.use(router);
// app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

