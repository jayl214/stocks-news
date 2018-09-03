import React, { Component } from 'react';
import axios from 'axios' //promise based ajax

class Navbar extends Component {

  state={

  }

  handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  userLogin = (loginEmail, loginPassword) => {
    axios.post("api/v1/auth/login", {
      email: loginEmail,
      password: loginPassword,
    })
    .then( (response) => {
      document.cookie = `Auth=${response.data.access_token}`
      this.props.getUserData()
      this.setState({
        jwt: document.cookie.slice(5)
      })
      alert(document.cookie)
      console.log(response.data)
      this.props.toggleLoginModalStatus()
    })
    .catch( (error) => {
      window.alert("Login Error");
      console.log(error);
    })
  }

  submitLoginForm = e =>{
    e.preventDefault()
    this.userLogin(this.state.loginEmail, this.state.loginPassword)
  }

  submitRegisterForm = e =>{
    e.preventDefault()
    axios.post("api/v1/auth/register", {
      name: this.state.registerName,
      email: this.state.registerEmail,
      password: this.state.registerPassword
    })
    .then( (response) => {
      console.log(response.data)
      this.userLogin(this.state.registerEmail, this.state.registerPassword)
      this.props.toggleLoginModalStatus()
    })
    .catch( (error) => {
      window.alert("Registration Error");
      console.log(error);
    })
  }

  render() {

    return (
      <header className="header">
        <div className="navbar">
          <span className = "navbar__logo--long">Stocks-News</span>
          <span className = "navbar__logo--short">Stocks-News</span>
          <div className = "navbar__button-group">
            <button className = "navbar__button" onClick={this.props.toggleLoginModalStatus}>Log in</button>
          </div>
        </div>

        <div className={`login-modal ${this.props.loginModalStatus}`}>
          <div className="login-modal-section register">
            <form onSubmit={this.submitRegisterForm}>
              <input
                name="registerName"
                type="text"
                placeholder="name..."
                value={this.state.registerName}
                onChange={this.handleInputChange} />
                <br/>
              <input
                name="registerEmail"
                type="email"
                placeholder="email..."
                value={this.state.registerEmail}
                onChange={this.handleInputChange} />
                <br/>
              <input
                name="registerPassword"
                type="password"
                placeholder="password..."
                value={this.state.registerPassword}
                onChange={this.handleInputChange} />
                <br/>
              <button>Register</button>
            </form>
          </div>

          <div className="login-modal-section login">
            <form onSubmit={this.submitLoginForm}>
              <input
                name="loginEmail"
                type="email"
                placeholder="email..."
                value={this.state.loginEmail}
                onChange={this.handleInputChange}/>
                <br/>
              <input
                name="loginPassword"
                type="password"
                placeholder="password..."
                value={this.state.loginPassword}
                onChange={this.handleInputChange} />
                <br/>
              <button>Login</button>
            </form>
          </div>

        </div>
      </header>
    )
  }

}

export default Navbar;