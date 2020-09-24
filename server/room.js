
/* roomName => {
            socketID => {
                {socketID, userName}
            }
        }
*/
const roomUsers = new Map();


/* roomName => {
            state => {
                videoID: DEFAULT_VIDEO_ID, 
                videoTimestamp: Date.now(),
                playerState: DEFAULT_VIDEO_STATE
            }
            queue => {
                [Video1, Video2, Video3...]
            }
            users => {
                {socketID, userName}, 
                {socketID, userName}, 
                {socketID, userName}
            }
        }
*/
const roomStates = new Map();


/* socketID => {
            roomName
        }
*/
const roomSocketIsIn = new Map();


const setupInitialRoomState = ({roomName, initialVideoState}) => {
    roomStates.set(roomName, {
        'videoState': Object.assign({}, initialVideoState),
        'videoQueue': [],
        'users': new Map()
    });
}


const updateRoomVideoState = ({roomName, clientVideoState}) => {
    let newRoomVideoState = Object.assign({}, clientVideoState);
    
    //calculate estimated timestamp
    //PLAYING: we store datetime offset by client video timestamp
    //PAUSED: we store actual timestamp of video instead of datetime
    if (clientVideoState["videoPS"] === 'PLAYING') {
        newRoomVideoState["videoTS"] = (Date.now() - (clientVideoState["videoTS"] * 1000));
    }
    
    //should always have room?
    if (roomStates.has(roomName)) {
        let currentRoomState = roomStates.get(roomName);
        currentRoomState.videoState = Object.assign({}, newRoomVideoState);
    }
}

const getRoomVideoState = (roomName) => {
    if (roomStates.has(roomName)) {
        const roomVideoState = roomStates.get(roomName).videoState;
        const videoStateToReturn = Object.assign({}, roomVideoState); //copy so we don't modify stored
        
        //calculate estimated timestamp
        //PLAYING: we stored datetime so subtract by current datetime
        //PAUSED: we stored actual timestamp of video instead of datetime, so just return that
        if (roomVideoState["videoPS"] === 'PLAYING') {
            videoStateToReturn["videoTS"] = (Date.now() - roomVideoState["videoTS"]) / 1000;
        }
        
        return videoStateToReturn;
    }
    return undefined;
}

const addUser = ({ socketID, userName, roomName }) => {
    //should possibly consider normalizing keys
    const user = { socketID, userName };
    
    let storedRoomState = roomStates.get(roomName);
    let usersInRoom = storedRoomState.users;
    usersInRoom.set(socketID, user);
    
    roomSocketIsIn.set(socketID, roomName);
    
    return {user};
}

const removeUser = ({ socketID }) => {
    let roomName = null;
    let userName = null;
    //get the room that this socket is in
    if (roomSocketIsIn.has(socketID)) {
        roomName = roomSocketIsIn.get(socketID);
        roomSocketIsIn.delete(socketID);
    }
    
    if (roomName && roomStates.has(roomName)) {
        //get the map of users in this room
        let usersInRoom = roomStates.get(roomName).users;
        const user = usersInRoom.get(socketID);
        userName = user.userName;
        
        //remove this user
        usersInRoom.delete(socketID);
        
        // if they were the last person, delete room data
        if (usersInRoom.size === 0) {
            roomStates.delete(roomName);
        }
    }
    return { roomName, userName };
}

const appendToRoomQueue = ({roomName, video}) => {
    let queue = [];
    if (roomStates.has(roomName)) {
        queue = roomStates.get(roomName).videoQueue;
        queue = [...queue, video];
        roomStates.get(roomName).videoQueue = queue;
    }
    return queue;
}

const removeFromRoomQueue = ({roomName, index}) => {
    let queue = [];
    if (roomStates.has(roomName)) {
        try {
            queue = roomStates.get(roomName).videoQueue;
            queue.splice(index, 1);
            roomStates.get(roomName).videoQueue = queue;
        } catch(e) {
            console.log(e);
        }
    }
    return queue
}

const getNextVideoInQueue = (roomName) => {
    if (roomStates.has(roomName)) {
        let queue = roomStates.get(roomName).videoQueue;
        const video = queue.shift();
        roomStates.get(roomName).videoQueue = queue;
        return {video, queue}
    }
    return undefined;
}

const getRoomQueue = (roomName) => {
    if (roomStates.has(roomName)) {
        return roomStates.get(roomName).videoQueue;
    }
    return [];
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

module.exports = { setupInitialRoomState, updateRoomVideoState, getRoomVideoState, addUser, removeUser, 
                   appendToRoomQueue, removeFromRoomQueue, getRoomQueue, getNextVideoInQueue };