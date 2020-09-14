const roomUsers = new Map();
const roomStates = new Map();
const roomSocketIsIn = new Map();


const updateRoomVideoState = ({roomName, videoState}) => {
    roomStates.set(roomName, Object.assign({}, videoState));
}

const getRoomVideoState = (roomName) => {
    if (roomStates.has(roomName)) {
        return roomStates.get(roomName);
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
    if (roomSocketIsIn.has(socketID)) {
        roomName = roomSocketIsIn.get(socketID);
        roomSocketIsIn.delete(socketID);
    }
    
    if (roomName && roomUsers.has(roomName)) {
        let room = roomUsers.get(roomName);
        room.delete(socketID);
        
        // if last person, delete entry in room map
        if (room.size === 0) {
            roomUsers.delete(roomName);
            roomStates.delete(roomName);
        }
    }
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