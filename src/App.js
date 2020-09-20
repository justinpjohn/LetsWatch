import React, {useState, useEffect}  from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect, useParams } from 'react-router-dom';

import {UserContext} from './UserContext';

import Home from './components/Home';
import Room from './components/Room';

import './stylesheets/main-page.css';

const { generateRandomName } = require('./utils/NameGenerator');

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
        if (roomName != user.room) setUser({...user, room: roomName});
        return <Room roomName/>;
    }

    return (
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
)};

export default App;