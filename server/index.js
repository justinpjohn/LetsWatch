const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const path = require('path');


const router = require('./router');
const { updateRoomVideoState, getRoomVideoState, addUser, removeUser, getRandomUserInRoom } = require('./room');
const PORT = process.env.PORT || 8081;
// const INDEX = '../';

// const app = express().use(express.static(__dirname + '/../build'));

// app.get('/*', function (req, res) {
//     res.sendFile(path.join(path.resolve(INDEX), 'build', 'index.html'));
// }); 

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

const DEFAULT_VIDEO_ID = 'nMVFSwfV6wk';
const DEFAULT_VIDEO_STATE = 'PLAYING';


io.on('connection', (socket) => {
    console.log('A user has connected.');
    
    socket.on('room connection', ({roomName, userName}) => {
        console.log(`${userName} has joined ${roomName}`);
        socket.join(roomName);
        
        let roomVideoState = getRoomVideoState(roomName);
        if (roomVideoState === undefined) {
            const newRoomVideoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTimestamp: Date.now(),
                playerState: DEFAULT_VIDEO_STATE
            };
            console.log('INSERTING FIRST ' + roomName);
            console.log(newRoomVideoState);
            updateRoomVideoState({roomName, videoState: newRoomVideoState});
        } else {
            const currDatetime = Date.now();
            const estimatedTimestamp = (currDatetime - roomVideoState["videoTimestamp"]) / 1000;
            roomVideoState["videoTimestamp"] = (estimatedTimestamp + 2);
        }
         
        socket.emit('socket connection');
        setTimeout(() => { socket.emit('video state', {roomVideoState}); }, 1000);
        
        socket.to(roomName).emit('room connection', `${userName} has joined the party! Say hi!`);
        addUser({
            socketID: socket.id, 
            userName, 
            roomName
        });
    });
    
    socket.on('chat message', ({roomName, userName, msg}) => {
        console.log(`received: ${msg} from ${roomName} by ${userName}`);
        io.to(roomName).emit('chat message', {
            authorSocketID: socket.id, 
            authorUserName: userName, 
            msg
        }); 
    });
    
    socket.on('video select', ({roomName, userName, videoState}) => {
        const videoID = videoState["videoID"];
        
        console.log('Server received video select: ' + videoID);
        console.log(videoState);
        
        let serverVideoState = Object.assign({}, videoState);
        serverVideoState["videoTimestamp"] = Date.now();
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        io.to(roomName).emit('video select', {
            requestingUser: userName, 
            videoState
        }); 
    }); 
    
    socket.on('seekSync', ({roomName, userName, videoState}) => {
        console.log('Server received sync: ');
        console.log(videoState);
        
        let serverVideoState = Object.assign({}, videoState);
        serverVideoState["videoTimestamp"] = Date.now() - (videoState["videoTimestamp"] * 1000);
        updateRoomVideoState({roomName, videoState: serverVideoState});

        console.log('emitting from server timestamp: ' + videoState["videoTimestamp"]);        
        io.to(roomName).emit('seekSync', {
            requestingUser: userName, 
            videoState
        });
    });
    
    socket.on('pauseSync', ({roomName, userName, videoState}) => {
        console.log('Server received pauseSync');
        console.log(videoState);
        
        let serverVideoState = Object.assign({}, videoState);
        serverVideoState["videoTimestamp"] = Date.now();
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        socket.to(roomName).emit('pauseSync', {requestingUser: userName});
    });
    
    socket.on('playSync', ({roomName, userName, videoState}) => {
        console.log('Server received playSync');
        console.log(videoState);
        
        let serverVideoState = Object.assign({}, videoState);
        serverVideoState["videoTimestamp"] = Date.now() - (videoState["videoTimestamp"] * 1000);
        updateRoomVideoState({roomName, videoState: serverVideoState});
        
        io.to(roomName).emit('playSync', {requestingUser: userName});
    });
    
    socket.on('disconnect', ({roomName, userName}) => {
        removeUser({socketID: socket.id, roomName});
        console.log(`${userName} has disconnected from ${roomName}`); 
    });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

