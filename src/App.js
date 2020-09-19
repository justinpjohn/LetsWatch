import React from 'react';

import { BrowserRouter as Router, Route, useParams, Redirect } from 'react-router-dom';

import Home from './components/Home';
import Room from './components/Room';

import './stylesheets/main-page.css';

const { generateRandomName } = require('./NameGenerator');

const App = () => (
    <Router>
        <Route exact path="/" component={ Home } />
        <Route exact path="/r/">
            {AssistedRoomRedirect()}
        </Route>
        <Route exact path="/r/:roomName">
            <DirectToRoom/>
        </Route>
    </Router>
);

//This function is defaulted if user tries to join a room via an empty room param
const AssistedRoomRedirect = () => {
    const roomName = generateRandomName();
    return <Redirect to={{pathname: `/r/${roomName}`}} />
}

const DirectToRoom = () => {
    let { roomName } = useParams();
    let userName = generateRandomName();
    if (!roomName) {
        roomName = generateRandomName();
    }
    
    return <Room roomname={roomName} username={userName} />
}

export default App;