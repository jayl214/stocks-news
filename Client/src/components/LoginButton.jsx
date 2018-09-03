import React, { Component } from 'react';

class LoginButton extends Component {

  render() {
    if(document.cookie){
      return (
        <button className = "navbar__button navbar__button--logout" onClick={this.props.logOut}>Log out</button>
      )
    }else{
      return(
        <button className = "navbar__button navbar__button--login" onClick={this.props.toggleLoginModalStatus}>Log in</button>
      )
    }

  }

}

export default LoginButton;