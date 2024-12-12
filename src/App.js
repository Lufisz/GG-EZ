import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/" />
        <Route path="/events" />
        <Route path="/matches" />
        <Route path="/signin" />
      </Switch>
    </Router>
  );
};

export default App;
