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

const DEFAULT_VIDEO_ID = '5qap5aO4i9A';
const DEFAULT_VIDEO_STATE = 'PLAYING';


io.on('connection', (socket) => {
    console.log('A user has connected.');
    
    socket.on('room connection', ({roomName, userName}) => {
        console.log(`${userName} has joined ${roomName}`);
        socket.join(roomName);
        
        const roomVideoState = getRoomVideoState(roomName);
        if (roomVideoState === undefined) {
            const videoState = {
                videoID: DEFAULT_VIDEO_ID, 
                videoTimestamp: Date.now(),
                playerState: DEFAULT_VIDEO_STATE
            };
            updateRoomVideoState({roomName, videoState});
        }
        console.log(roomVideoState);
         
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
        
        updateRoomVideoState({roomName, videoState});
        io.to(roomName).emit('video select', {
            requestingUser: userName, 
            requestingVideoID: videoID
        }); 
    }); 
    
    socket.on('seekSync', ({roomName, userName, videoState}) => {
        console.log('Server received sync: ');
        console.log(videoState);
        
        const videoID = videoState["videoID"];
        updateRoomVideoState({roomName, videoState});
        
        console.log('emitting from server timestamp: ' + videoState["videoTimestamp"]);
        
        io.to(roomName).emit('seekSync', {
            userName, 
            reqUserVideoPos: videoState["videoTimestamp"]
        });
    });
    
    socket.on('pauseSync', ({roomName, userName, videoState}) => {
        console.log('Server received pauseSync');
        console.log(videoState);
        
        const videoID = videoState["videoID"];
        updateRoomVideoState({roomName, videoState});
        socket.to(roomName).emit('pauseSync', {userName});
    });
    
    socket.on('playSync', ({roomName, userName, videoState}) => {
        console.log('Server received playSync');
        console.log(videoState);
        
        const videoID = videoState["videoID"];
        updateRoomVideoState({roomName, videoState});
        socket.to(roomName).emit('playSync', {userName});
    });
    
    socket.on('disconnect', ({roomName}) => {
        removeUser({socketID: socket.id, roomName});
        console.log('A user has disconnected.'); 
    });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

