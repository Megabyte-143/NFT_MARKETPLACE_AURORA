import './App.css';
import React from 'react';
import { BrowserRouter as Router,Switch,Route  } from 'react-router-dom';
// import Header from './components/Header';
// import Home from './components/DataNFT';
import Direct from './components/direct';
import Timed from './components/timed';
import Unlim from './components/unlim';
import All from './components/all'
import Create from './components/Create';
import User from './components/User';
function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path = '/'>
            <All/>
          </Route>
          <Route exact path = '/direct'>
            <Direct/>
          </Route>
          <Route exact path = '/timed'>
            <Timed/>
          </Route>
          <Route exact path = '/unlim'>
            <Unlim/>
          </Route>
          <Route exact path = '/Create'>
            <Create/>
          </Route>
          <Route exact path = '/User'>
            <User/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
