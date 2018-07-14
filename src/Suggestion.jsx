import React, { Component } from 'react';

class Suggestion extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li symbol={this.props.suggestion.symbol}>
        {this.props.suggestion.name} ({this.props.suggestion.symbol})
      </li>

    );
  }

}

export default Suggestion;