import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './components/Home';
import Room from './components/Room';

import './stylesheets/main-page.css';

const App = () => (
  <Router>
    <Route path="/" exact component={ Home } />
    <Route path="/room" component={ Room } />
  </Router>
);


export default App;