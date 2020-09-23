const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./router');
const { updateRoomVideoState, getRoomVideoState, addUser, removeUser } = require('./room');
const PORT = process.env.PORT || 8080;

const app = express();
// const app = express().use(express.static(__dirname + '/../build'));

app.use(cors({credentials: true, origin: true}));
app.use(router);

const server = http.createServer(app);
const io     = socketio(server);

const DEFAULT_VIDEO_ID    = process.env.REACT_APP_DEFAULT_VIDEO_ID || 'qsdzdUYl5c0';
const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE || 'PLAYING';


let queue = [];


io.on('connection', (socket) => {
    console.log('socket join ');
    
    socket.on('room connection', ({user}) => {
        socket.join(user.room);
        
        let roomVideoState = getRoomVideoState(user.room);
        if (!roomVideoState) {
            const newRoomVideoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTS: Date.now(),
                videoPS: DEFAULT_VIDEO_STATE
            };
            // set the initial state, since it doesn't exist
            updateRoomVideoState({roomName: user.room, clientVideoState: newRoomVideoState});
        }
        socket.emit('initial sync', {serverVideoState: roomVideoState}); 
        
        socket.to(user.room).emit('chat message', {
            authorSocketID: 'admin', 
            authorUserName: '', 
            msg: `${user.name} has joined the party! Say hi!`
        });
        
        addUser({ socketID: socket.id, userName: user.name, roomName: user.room });
    });
    
    socket.on('chat message', ({user, msg}) => {
        io.to(user.room).emit('chat message', {
            authorSocketID: socket.id, 
            authorUserName: user.name, 
            msg
        }); 
    });
    
    socket.on('queue append', ({user, video}) => {
        queue = [...queue, video];
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        }); 
    });
    
    socket.on('queue remove', ({user, index}) => {
        try {
            console.log(index);
            queue.splice(index, 1);
            io.to(user.room).emit('queue update', {
                requestingUser: user.name, 
                serverQueueState: queue
            }); 
        } catch(e) {
            console.log(e);
        }
    });
    
    socket.on('end', ({user}) => {
        const video = queue.shift();
        if (!video) return;
        console.log(video);
        
        const newRoomVideoState = {
            videoID: video.id.videoId, 
            videoTS: Date.now(),
            videoPS: DEFAULT_VIDEO_STATE
        };
        updateRoomVideoState({roomName: user.room, clientVideoState: newRoomVideoState});
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        }); 
        io.to(user.room).emit('select', {
            requestingUser: user.name, 
            serverVideoState: newRoomVideoState
        }); 
    });
    
    socket.on('select', ({user, clientVideoState}) => {
        updateRoomVideoState({roomName: user.room, clientVideoState});
        
        io.to(user.room).emit('select', {
            requestingUser: user.name, 
            serverVideoState: clientVideoState
        }); 
    }); 
    
    socket.on('seek', ({user, clientVideoState}) => {
        updateRoomVideoState({roomName: user.room, clientVideoState});

        io.to(user.room).emit('seek', {
            requestingUser: user.name, 
            serverVideoState: clientVideoState
        });
    });
    
    socket.on('pause', ({user, clientVideoState}) => {
        updateRoomVideoState({roomName: user.room, clientVideoState});
        socket.to(user.room).emit('pause', {requestingUser: user.name});
    });
    
    socket.on('play', ({user, clientVideoState}) => {
        updateRoomVideoState({roomName: user.room, clientVideoState});
        socket.to(user.room).emit('play', {requestingUser: user.name});
    });
    
    socket.on('disconnect', ({user}) => {
        // for some reason the roomName and userName is always undefined?
        const response = removeUser({socketID: socket.id, roomName: undefined});
        
        io.to(response["roomName"]).emit('chat message', {
            authorSocketID: 'admin', 
            authorUserName: '', 
            msg: `${response["userName"]} has left the party! Adios!`
        });
    });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

