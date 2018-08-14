import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import Home from "./Home";
import Subpage from "./Subpage";
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="TopBar">
          <Link to="/">Home</Link>
          <Link to="/subpage">Subpage</Link>
        </div>
          <Route exact path="/" component={Home} />
          <Route exact path="/subpage" component={Subpage} />
      </div>
    );
  }
}
export default App;