import React, { useState } from "react";
import AuthenticationPage from "./AuthenticationPage"
import BaseLayout from "./BaseLayout"
import { Controller } from "../loginController"

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const submitForm = async (username: string, password: string): Promise<boolean> => {
    const loginWorker: Controller = new Controller();
    const isAuthenticated = await loginWorker.login(username, password);
    if (isAuthenticated) {
      const userId: string = await loginWorker.getUser()
      setIsAuthenticated(isAuthenticated)
      setUserId(userId)
      return true
    }
    return false
  }

  const logOut = async (): Promise<void> => {
    const loginWorker: Controller = new Controller();
    await loginWorker.logOut();
    setIsAuthenticated(false)
  }
  return (
      <div>
        { !isAuthenticated && <AuthenticationPage onSubmissionClick={submitForm} />}
        { isAuthenticated && <BaseLayout onLogOutClick={logOut} userId={userId} />}
      </div>
  )
}

export default App