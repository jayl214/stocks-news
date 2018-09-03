import React, { Component } from 'react';

class Welcome extends Component {

  render() {
    if(document.cookie){
      return (
        <h3>Welcome, {this.props.userData.name}</h3>
      )
    }else{
      return ('')
    }
  }

}

export default Welcome;