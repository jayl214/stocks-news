import React, { Component } from 'react';

class Suggestion extends Component {

  render() {
    return (
      <li ticker={this.props.suggestion.symbol} name={this.props.suggestion.name} onClick={this.props.selectSuggestion} >
        {this.props.suggestion.name} ({this.props.suggestion.symbol})
      </li>

    );
  }

}

export default Suggestion;