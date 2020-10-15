import React, { useState } from "react";
import ReactDOM from 'react-dom';
import AuthenticationPage from "./components/Authenticationpage"
import BaseLayout from "./components/BaseLayout"
import { Controller } from "./loginController"

interface IAppState {
  isAuthenticated: boolean
  userId: string | null
}

export class App extends React.Component<{}, IAppState>{
  constructor() {
    super({});
    this.state = {
      isAuthenticated: false,
      userId: null
    }
    this.submitForm = this.submitForm.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  async submitForm(username: string, password: string): Promise<boolean> {
    const loginWorker: Controller = new Controller();
    const isAuthenticated = await loginWorker.login(username, password);
    if (isAuthenticated) {
      const userId: string  = await loginWorker.getUser()
      this.setState({ isAuthenticated: isAuthenticated, userId: userId })
      return true
    }
    return false
  }

  async logOut(): Promise<void> {
    const loginWorker: Controller = new Controller();
    await loginWorker.logOut();
    this.setState({ isAuthenticated: false })
  }

  render() {
    return (
      <div>
        { !this.state.isAuthenticated && <AuthenticationPage onSubmissionClick={this.submitForm} />}
        { this.state.isAuthenticated && <BaseLayout onLogOutClick={this.logOut} userId={this.state.userId}/>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.body)