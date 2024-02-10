import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {pin: '', userId: '', errorMsg: '', showErrMsg: false}

  onChangeUserName = event => {
    this.setState({userId: event.target.value})
  }

  onChangePassword = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 600, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }

  onSumbitForm = async event => {
    event.preventDefault()

    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}

    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {pin, userId, errorMsg, showErrMsg} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="image"
          />
          <div className="login-container">
            <h1 className="heading">Welcome Back!</h1>
            <form className="form-container" onSubmit={this.onSumbitForm}>
              <div className="input-container">
                <label className="label" htmlFor="userId">
                  User ID
                </label>
                <input
                  className="input"
                  type="text"
                  id="userId"
                  placeholder="Enter User ID"
                  onChange={this.onChangeUserName}
                  value={userId}
                />
              </div>
              <div className="input-container">
                <label className="label" htmlFor="pin">
                  PIN
                </label>
                <input
                  type="password"
                  className="input"
                  id="pin"
                  placeholder="Enter Pin"
                  value={pin}
                  onChange={this.onChangePassword}
                />
              </div>
              <button className="loginButton" type="submit">
                Login
              </button>
              {showErrMsg && <p className="errMsg">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
