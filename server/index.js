const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');


const router = require('./router');
const { updateRoomVideoState, getRoomVideoState, addUser, removeUser, getRandomUserInRoom } = require('./room');
const PORT = process.env.PORT || 8080;
const INDEX = '../';

const app = express().use(express.static(__dirname + '/../build'));

app.get('/*', function (req, res) {
    res.sendFile(path.join(path.resolve(INDEX), 'build', 'index.html'));
}); 

// const app = express();
app.use(cors({credentials: true, origin: true}));
app.use(router);

const server = http.createServer(app);
const io = socketio(server);

const DEFAULT_VIDEO_ID = 'nMVFSwfV6wk';
const DEFAULT_VIDEO_STATE = 'PLAYING';


io.on('connection', (socket) => {

    socket.on('room connection', ({roomName, userName}) => {
        console.log(`${userName} has joined ${roomName}`);
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
            const currDatetime = Date.now();
            const estimatedTimestamp = (currDatetime - roomVideoState["videoTimestamp"]) / 1000;
            roomVideoState["videoTimestamp"] = (estimatedTimestamp + 2);
        }
         
        socket.emit('socket connection');
        setTimeout(() => { socket.emit('initial sync', {serverVideoState: roomVideoState}); }, 1000);
        
        socket.to(roomName).emit('room connection', `${userName} has joined the party! Say hi!`);
        addUser({
            socketID: socket.id, 
            userName, 
            roomName
        });
    });
    
    socket.on('chat message', ({roomName, userName, msg}) => {
        // console.log(`received: ${msg} from ${roomName} by ${userName}`);
        io.to(roomName).emit('chat message', {
            authorSocketID: socket.id, 
            authorUserName: userName, 
            msg
        }); 
    });
    
    socket.on('select', ({roomName, userName, clientVideoState}) => {
        const videoID = clientVideoState["videoID"];
        
        // console.log('Server received video select: ' + videoID);
        // console.log(clientVideoState);
        
        let serverVideoState = Object.assign({}, clientVideoState);
        serverVideoState["videoTimestamp"] = Date.now();
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        io.to(roomName).emit('select', {
            requestingUser: userName, 
            serverVideoState: clientVideoState
        }); 
    }); 
    
    socket.on('seek', ({roomName, userName, clientVideoState}) => {
        // console.log('Server received sync: ');
        // console.log(clientVideoState);
        
        let serverVideoState = Object.assign({}, clientVideoState);
        serverVideoState["videoTimestamp"] = Date.now() - (clientVideoState["videoTimestamp"] * 1000);
        updateRoomVideoState({roomName, videoState: serverVideoState});

        // console.log('emitting from server timestamp: ' + clientVideoState["videoTimestamp"]);        
        io.to(roomName).emit('seek', {
            requestingUser: userName, 
            serverVideoState: clientVideoState
        });
    });
    
    socket.on('pause', ({roomName, userName, clientVideoState}) => {
        // console.log('Server received pauseSync');
        // console.log(clientVideoState);
        
        let serverVideoState = Object.assign({}, clientVideoState);
        serverVideoState["videoTimestamp"] = Date.now();
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        socket.to(roomName).emit('pause', {requestingUser: userName});
    });
    
    socket.on('play', ({roomName, userName, clientVideoState}) => {
        // console.log('Server received playSync');
        // console.log(clientVideoState);
        
        let serverVideoState = Object.assign({}, clientVideoState);
        serverVideoState["videoTimestamp"] = Date.now() - (clientVideoState["videoTimestamp"] * 1000);
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        socket.to(roomName).emit('play', {requestingUser: userName});
    });
    
    socket.on('disconnect', ({roomName, userName}) => {
        removeUser({socketID: socket.id, roomName});
        console.log(`${userName} has disconnected from ${roomName}`); 
    });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

