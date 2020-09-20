import React,{useState}  from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import {UserContext} from './UserContext';

import Home from './components/Home';
import Room from './components/Room';

import './stylesheets/main-page.css';

const { generateRandomName } = require('./utils/NameGenerator');

const App = () => {
    const [user, setUser] = useState({userName: generateRandomName(), roomName: generateRandomName()})

    return (
        <UserContext.Provider value={{user, setUser}}>
            <Router>
                <Switch>
                    <Route exact path="/r/:roomName">
                        <Room />
                    </Route>
                    <Route path="/r/*">
                        {AssistedRoomRedirect(user)}
                    </Route>
                    <Route path="*" component={ Home } />
                </Switch>
            </Router>
        </UserContext.Provider>
)};

//This function is defaulted if user tries to join a room via an empty room param
const AssistedRoomRedirect = (user) => {
    return <Redirect to={{pathname: `/r/${user["roomName"]}`}} />
}

export default App;