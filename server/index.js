const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const router = require('./router');
const { updateRoomVideoState, getRoomVideoState, addUser, removeUser } = require('./room');
const PORT = process.env.PORT || 8080;

const app = express().use(express.static(__dirname + '/../build'));
app.use(cors({credentials: true, origin: true}));
app.use(router);

const server = http.createServer(app);
const io     = socketio(server);

const DEFAULT_VIDEO_ID    = process.env.REACT_APP_DEFAULT_VIDEO_ID || 'qsdzdUYl5c0';
const DEFAULT_VIDEO_STATE = process.env.REACT_APP_DEFAULT_VIDEO_STATE || 'PLAYING';


io.on('connection', (socket) => {

    socket.on('room connection', ({roomName, userName}) => {
        socket.join(roomName);
        
        let roomVideoState = getRoomVideoState(roomName);
        if (!roomVideoState) {
            const newRoomVideoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTimestamp: Date.now(),
                playerState: DEFAULT_VIDEO_STATE
            };
            // set the initial state, since it doesn't exist
            updateRoomVideoState({roomName, videoState: newRoomVideoState});
        } else {
            const storedRoomState = Object.assign({}, roomVideoState);
            const estimatedTimestamp = (Date.now() - roomVideoState["videoTimestamp"]) / 1000;
            storedRoomState["videoTimestamp"] = estimatedTimestamp;
            roomVideoState = storedRoomState
        }
         
        socket.emit('initial sync', {serverVideoState: roomVideoState}); 
        
        socket.to(roomName).emit('chat message', {
            authorSocketID: 'admin', 
            authorUserName: '', 
            msg: `${userName} has joined the party! Say hi!`
        });
        
        addUser({ socketID: socket.id, userName, roomName });
    });
    
    socket.on('chat message', ({roomName, userName, msg}) => {
        io.to(roomName).emit('chat message', {
            authorSocketID: socket.id, 
            authorUserName: userName, 
            msg
        }); 
    });
    
    socket.on('select', ({roomName, userName, clientVideoState}) => {
        storeClientVideoState({roomName, userName, clientVideoState});
        
        io.to(roomName).emit('select', {
            requestingUser: userName, 
            serverVideoState: clientVideoState
        }); 
    }); 
    
    socket.on('seek', ({roomName, userName, clientVideoState}) => {
        storeClientVideoState({roomName, userName, clientVideoState});

        io.to(roomName).emit('seek', {
            requestingUser: userName, 
            serverVideoState: clientVideoState
        });
    });
    
    socket.on('pause', ({roomName, userName, clientVideoState}) => {
        storeClientVideoState({roomName, userName, clientVideoState});
        socket.to(roomName).emit('pause', {requestingUser: userName});
    });
    
    socket.on('play', ({roomName, userName, clientVideoState}) => {
        storeClientVideoState({roomName, userName, clientVideoState});
        socket.to(roomName).emit('play', {requestingUser: userName});
    });
    
    socket.on('disconnect', ({roomName, userName}) => {
        // for some reason the roomName and userName is always undefined?
        const response = removeUser({socketID: socket.id, roomName});
        
        io.to(response["roomName"]).emit('chat message', {
            authorSocketID: 'admin', 
            authorUserName: '', 
            msg: `${response["userName"]} has left the party! Adios!`
        });
    });
});

const storeClientVideoState = ({roomName, userName, clientVideoState}) => {
    let serverVideoState = Object.assign({}, clientVideoState);
    serverVideoState["videoTimestamp"] = Date.now() - (clientVideoState["videoTimestamp"] * 1000);
    updateRoomVideoState({roomName, videoState: serverVideoState});
}

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

