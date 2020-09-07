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
//   name = name.trim().toLowerCase();
//   room = room.trim().toLowerCase();

    if (!(rooms.has(roomName))) {
        rooms.set(roomName, new Map());
    }
    
    const user = { socketID, userName };
    rooms.get(roomName).set(socketID, user);
    
    return {user};
}

const removeUser = ({ socketID, roomName }) => {
    if (rooms.has(roomName)) {
        let room = rooms.get(roomName);
        room.delete(socketID);
        
        // if last person, delete entry in room map
        if (room.size === 0) {
            rooms.delete(roomName);
            roomStates.delete(roomName);
            console.log(`removing ${roomName} from map'`);
        }
    }
}

// not really random, just pick first person?
const getRandomUserInRoom = (roomName) => {
    // console.log('request room: ' + roomName);
    // console.log(rooms);
    
    if (!(rooms.has(roomName))) {
        console.log('could not get random user, because room doesnt exist');
        return undefined;
    }

    let keys = rooms.get(roomName).keys();
    let next = keys.next().value;
    
    return rooms.get(roomName).get(next);
}

// const getUser = (socketId) => users.find((user) => user.socketId === socketId);
// const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { updateRoomVideoState, getRoomVideoState, addUser, removeUser, getRandomUserInRoom };