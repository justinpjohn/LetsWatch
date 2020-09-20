const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');

const router = require('./router');
const { updateRoomVideoState, getRoomVideoState, addUser, removeUser } = require('./room');
const PORT = process.env.PORT || 8080;

const app = express();
// const app = express().use(express.static(__dirname + '/../build'));

// const INDEX = '../';
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(path.resolve(INDEX), 'build', 'index.html'));
// }); 

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
            const newRoomVideoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTimestamp: Date.now(),
                playerState: DEFAULT_VIDEO_STATE
            };
            // set the initial state, since it doesn't exist
            updateRoomVideoState({roomName: user.room, videoState: newRoomVideoState});
        } else {
            const storedRoomState = Object.assign({}, roomVideoState);
            const estimatedTimestamp = (Date.now() - roomVideoState["videoTimestamp"]) / 1000;
            storedRoomState["videoTimestamp"] = estimatedTimestamp;
            roomVideoState = storedRoomState
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
    
    socket.on('select', ({user, clientVideoState}) => {
        storeClientVideoState({roomName: user.room, clientVideoState});
        
        io.to(user.room).emit('select', {
            requestingUser: user.name, 
            serverVideoState: clientVideoState
        }); 
    }); 
    
    socket.on('seek', ({user, clientVideoState}) => {
        storeClientVideoState({roomName: user.room, clientVideoState});

        io.to(user.room).emit('seek', {
            requestingUser: user.name, 
            serverVideoState: clientVideoState
        });
    });
    
    socket.on('pause', ({user, clientVideoState}) => {
        storeClientVideoState({roomName: user.room, clientVideoState});
        socket.to(user.room).emit('pause', {requestingUser: user.name});
    });
    
    socket.on('play', ({user, clientVideoState}) => {
        storeClientVideoState({roomName: user.room, clientVideoState});
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

const storeClientVideoState = ({roomName, clientVideoState}) => {
    let serverVideoState = Object.assign({}, clientVideoState);
    serverVideoState["videoTimestamp"] = Date.now() - (clientVideoState["videoTimestamp"] * 1000);
    updateRoomVideoState({roomName, videoState: serverVideoState});
}

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

