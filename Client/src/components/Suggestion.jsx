import React, { Component } from 'react';

class Suggestion extends Component {



  render() {
    return (
      <div className="searchbar-suggestion"
           ticker={this.props.suggestion.symbol}
           name={this.props.suggestion.name}
           onMouseDown={this.props.selectTargetCompany} >
        {this.props.suggestion.name} ({this.props.suggestion.symbol})
      </div>

    );
  }

}

export default Suggestion;