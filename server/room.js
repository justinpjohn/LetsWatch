
/* roomName => {
            socketID => {
                {socketID, userName}
            }
        }
*/
const roomUsers = new Map();


/* roomName => {
            videoID: DEFAULT_VIDEO_ID, 
            videoTimestamp: Date.now(),
            playerState: DEFAULT_VIDEO_STATE
        }
*/
const roomStates = new Map();


/* socketID => {
            roomName
        }
*/
const roomSocketIsIn = new Map();


const updateRoomVideoState = ({roomName, clientVideoState}) => {
    let roomVideoState = Object.assign({}, clientVideoState);
    
    //calculate estimated timestamp
    //PLAYING: we store datetime offset by client video timestamp
    //PAUSED: we store actual timestamp of video instead of datetime
    if (clientVideoState["videoPS"] === 'PLAYING') {
        roomVideoState["videoTS"] = (Date.now() - (clientVideoState["videoTS"] * 1000));
    }
    
    roomStates.set(roomName, Object.assign({}, roomVideoState));
}

const getRoomVideoState = (roomName) => {
    if (roomStates.has(roomName)) {
        const storedRoomState = roomStates.get(roomName);
        const roomVideoState = Object.assign({}, storedRoomState); //copy so we don't modify stored
        
        //calculate estimated timestamp
        //PLAYING: we stored datetime so subtract by current datetime
        //PAUSED: we stored actual timestamp of video instead of datetime, so just return that
        if (storedRoomState["videoPS"] === 'PLAYING') {
            roomVideoState["videoTS"] = (Date.now() - storedRoomState["videoTS"]) / 1000;
        }
        
        return roomVideoState;
    }
    return undefined;
}

const addUser = ({ socketID, userName, roomName }) => {
    //should possibly consider normalizing keys
    if (!(roomUsers.has(roomName))) {
        roomUsers.set(roomName, new Map());
    }
    
    const user = { socketID, userName };
    roomUsers.get(roomName).set(socketID, user);
    roomSocketIsIn.set(socketID, roomName);
    
    return {user};
}

const removeUser = ({ socketID }) => {
    let roomName = null;
    let userName = null;
    if (roomSocketIsIn.has(socketID)) {
        roomName = roomSocketIsIn.get(socketID);
        roomSocketIsIn.delete(socketID);
    }
    
    if (roomName && roomUsers.has(roomName)) {
        let room = roomUsers.get(roomName);
        const user = room.get(socketID);
        userName = user["userName"];
        room.delete(socketID);
        
        // if last person, delete entry in room map
        if (room.size === 0) {
            roomUsers.delete(roomName);
            roomStates.delete(roomName);
        }
    }
    return { roomName, userName };
}

// not really random, just pick first person?
const getRandomUserInRoom = (roomName) => {
    if (!(roomUsers.has(roomName))) {
        return undefined;
    }

    let keys = roomUsers.get(roomName).keys();
    let next = keys.next().value;
    
    return roomUsers.get(roomName).get(next);
}

module.exports = { updateRoomVideoState, getRoomVideoState, addUser, removeUser, getRandomUserInRoom };