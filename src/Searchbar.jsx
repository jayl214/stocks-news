import React, { Component } from 'react';
import Suggestion from './Suggestion.jsx'

class Searchbar extends Component {

  render() {
    return (

      <div>
        <input type="text" placeholder="Company" onKeyUp = {this.props.searchbarSearch} />
        <ul>
          {this.props.searchbarSuggestions.map((suggestion, index)=>{
            return <Suggestion suggestion = {suggestion} key = {index} selectSuggestion = {this.props.selectSuggestion} />
          }) }
        </ul>
      </div>

    );
  }

}

export default Searchbar;