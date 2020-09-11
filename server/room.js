const users = new Map();
const rooms = new Map();
const roomStates = new Map();


const updateRoomVideoState = ({roomName, videoState}) => {
    roomStates.set(roomName, videoState);
}

const getRoomVideoState = (roomName) => {
    if (roomStates.has(roomName)) {
        return roomStates.get(roomName);
    }
    return undefined;
}

const addUser = ({ socketID, userName, roomName }) => {
    //should possibly consider normalizing keys
    if (!(rooms.has(roomName))) {
        rooms.set(roomName, new Map());
    }
    
    const user = { socketID, userName };
    rooms.get(roomName).set(socketID, user);
    users.set(socketID, roomName);
    
    return {user};
}

const removeUser = ({ socketID }) => {
    let roomName = null;
    if (users.has(socketID)) {
        roomName = users.get(socketID);
        users.delete(socketID);
    }
    
    if (roomName && rooms.has(roomName)) {
        let room = rooms.get(roomName);
        room.delete(socketID);
        
        // if last person, delete entry in room map
        if (room.size === 0) {
            rooms.delete(roomName);
            roomStates.delete(roomName);
        }
    }
}

// not really random, just pick first person?
const getRandomUserInRoom = (roomName) => {
    if (!(rooms.has(roomName))) {
        return undefined;
    }

    let keys = rooms.get(roomName).keys();
    let next = keys.next().value;
    
    return rooms.get(roomName).get(next);
}

module.exports = { updateRoomVideoState, getRoomVideoState, addUser, removeUser, getRandomUserInRoom };