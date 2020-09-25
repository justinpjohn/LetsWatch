const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./router');
const { setupInitialRoomState, updateRoomVideoState, getRoomVideoState, addUser, removeUser,
        batchAppendToRoomQueue, appendToRoomQueue, removeFromRoomQueue, 
        getRoomQueue, getNextVideoInQueue} = require('./room');
const PORT = process.env.PORT || 8080;

const app = express();
// const app = express().use(express.static(__dirname + '/../build'));

app.use(cors({credentials: true, origin: true}));
app.use(router);

const server = http.createServer(app);
const io     = socketio(server);

const DEFAULT_VIDEO_ID    = process.env.REACT_APP_DEFAULT_VIDEO_ID || 'qsdzdUYl5c0';
const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE || 'PLAYING';


io.on('connection', (socket) => {

    socket.on('room connection', ({user}) => {
        socket.join(user.room);
        
        let roomVideoState = getRoomVideoState(user.room);
        if (!roomVideoState) {
            const initialVideoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTS: Date.now(),
                videoPS: DEFAULT_VIDEO_STATE
            };
            // set the initial state, since it doesn't exist
            setupInitialRoomState({roomName: user.room, initialVideoState});
        }
        socket.emit('initial sync', {serverVideoState: roomVideoState});
        
        const currentRoomQueue = getRoomQueue(user.room);
        socket.emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: currentRoomQueue
        }); 
        
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
        let queue = appendToRoomQueue({roomName: user.room, video});
        console.log(video);
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        }); 
    });
    
    socket.on('batch append', ({user, videos}) => {
        let queue = batchAppendToRoomQueue({roomName: user.room, videos});
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        }); 
    });
    
    socket.on('queue remove', ({user, index}) => {
        let queue = removeFromRoomQueue({roomName: user.room, index});
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        }); 
    });
    
    socket.on('end', ({user, clientVideoState}) => {
        // Design Problem: all user's are sending a video 'end' event. We wan't
        // to make sure that we only respond to this first one by checking if the 
        // video has already changed.
        const videoState = getRoomVideoState(user.room);
        if (videoState && clientVideoState.videoID !== videoState.videoID) return;
        
        const {video, queue} = getNextVideoInQueue(user.room);
        if (!video) return; // if !video, queue was empty. 
        
        const newRoomVideoState = {
            videoID: video.videoId, 
            videoTS: Date.now(),
            videoPS: DEFAULT_VIDEO_STATE
        };
        updateRoomVideoState({roomName: user.room, clientVideoState: newRoomVideoState});
        
        io.to(user.room).emit('queue update', {
            requestingUser: user.name, 
            serverQueueState: queue
        });
        
        const serverVideoState = Object.assign({}, newRoomVideoState);
        serverVideoState.videoTS = 0;
        io.to(user.room).emit('select', {
            requestingUser: user.name, 
            serverVideoState
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

