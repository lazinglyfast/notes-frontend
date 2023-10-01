import { useState } from "react"
import loginService from "../services/login"
import notesService from "../services/notes"
import PropTypes from "prop-types"

const LoginForm = ({
  setUser,
  setAttemptLogin,
  notify,
}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        "loggedUser", JSON.stringify(user)
      )
      notesService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
      setAttemptLogin(false)
      notify({ text: "Successful login", type: "success" })
    } catch (exception) {
      notify({ text: "Wrong credentials", type: "error" })
      setUser(null)
    }
  }

  return (
    <form>
      <div>
        <label>username</label>
        <input id="username" type="text" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        <label>password</label>
        <input id="password" type="password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button id="login" type="button" onClick={handleLogin}>login</button>
      <button type="button" onClick={() => setAttemptLogin(false)}>cancel</button>
    </form>
  )
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setAttemptLogin: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default LoginForm
