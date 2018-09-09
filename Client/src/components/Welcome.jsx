import React, { Component } from 'react';

class Welcome extends Component {

  render() {
    if(this.props.userData.name){
      return (
        <div>Welcome, {this.props.userData.name}</div>
      )
    }else{
      return ('')
    }
  }

}

export default Welcome;