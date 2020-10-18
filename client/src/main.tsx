import React, { useState } from "react";
import ReactDOM from 'react-dom';
import LandingPage from "./components/LandingPage"
import App from "./components/App"
import {
  BrowserRouter,
  Route,
  Redirect
} from "react-router-dom";

const Main: React.FC = () => {

  return (
    <BrowserRouter>
      <Route exact path="/">
        {<Redirect to="/landing"/>}
      </Route>
      <Route path="/landing" component={LandingPage} />
      <Route path="/app" component={App} />
    </BrowserRouter>
  )
}


ReactDOM.render(<Main />, document.body)