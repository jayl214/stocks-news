import React, { Component } from 'react';

class Graph extends Component {

  componentDidUpdate(prevProps, prevState, snapshot){
    // console.log(this.props)
  }


  render() {
    return (
      <div>
        {/*<h2>{this.props.targetName}</h2>*/}
        <canvas id="stockChart"></canvas>
      </div>
    )
  }

}

export default Graph;