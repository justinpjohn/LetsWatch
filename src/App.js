import React, {useState}  from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect, useParams } from 'react-router-dom';

import io from 'socket.io-client';

import {UserContext} from './contexts/UserContext';
import {SocketContext} from './contexts/SocketContext';
import Home from './components/Home';
import Room from './components/Room';

import './stylesheets/main-page.css';

const { generateRandomName } = require('./utils/NameGenerator');
const SERVER_URL = 'https://9e057b5691a24d17a179648c6553f432.vfs.cloud9.us-east-1.amazonaws.com/';

const socket = io(SERVER_URL);

const App = () => {
    const [user, setUser] = useState({name: generateRandomName(), room: generateRandomName()});

    //This function is defaulted to if user tries to join a room via an empty room param
    const AssistedRoomRedirect = () => {
        return <Redirect to={{pathname: `/r/${user.room}`}} />
    }
    
    const RoomDirect = () => {
        const {roomName} = useParams();
        //if a user is attempting to join a room via url params,
        //make sure to update their user state.
        //The roomName check ensures we don't continuously re-render.
        if (roomName !== user.room) setUser({...user, room: roomName});
        return <Room roomName/>;
    }

    return (
        <SocketContext.Provider value={socket}>
            <UserContext.Provider value={{user, setUser}}>
                <Router>
                    <Switch>
                        <Route exact path="/r/:roomName">
                            <RoomDirect/>
                        </Route>
                        <Route path="/r/*">
                            {AssistedRoomRedirect}
                        </Route>
                        <Route path="*" component={ Home } />
                    </Switch>
                </Router>
            </UserContext.Provider>
        </SocketContext.Provider>
)};

export default App;