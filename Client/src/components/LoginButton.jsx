import React, { Component } from 'react';

class LoginButton extends Component {

  render() {
    if(this.props.userData.name){
      return (
        <div className="navbar__hamburger" onClick={this.props.togglePortfolioModalStatus}>
          <i className="fas fa-bars"></i>
        </div>
      )
    }else{
      return(
        <div>
          <button className = "navbar__button navbar__button--login" onClick={this.props.toggleLoginModalStatus}>Log in</button>
        </div>
      )
    }

  }

}

export default LoginButton;