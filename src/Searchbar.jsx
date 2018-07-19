import React, { Component } from 'react';
import Suggestion from './Suggestion.jsx'

class Searchbar extends Component {

  isSuggestionsActive = () => {
    if(this.props.searchbarSuggestions.length>0){
      return 'visible'
    }else{
      return 'hidden'
    }
  }

  render() {
    return (
      <div className="searchbar">
        <input className="searchbar-input" type="text" placeholder="Company" onKeyUp = {this.props.searchbarSearch} onBlur = {this.props.hideSuggestions} />
        <div className={`searchbar-suggestions ${this.isSuggestionsActive()}`}>
          {this.props.searchbarSuggestions.map((suggestion, index)=>{
            return <Suggestion suggestion = {suggestion} key = {index} selectSuggestion = {this.props.selectSuggestion} />
          }) }
        </div>
      </div>

    );
  }

}

export default Searchbar;