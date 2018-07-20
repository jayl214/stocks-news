import React, { Component } from 'react';
import axios from 'axios' //promise based ajax
import Fuse from 'fuse.js' //fuzzy searcher
import Suggestion from './Suggestion.jsx'

class Searchbar extends Component {

  state = {
    searchbarSuggestions: [],
    companyTickersAndNames: [],
  }

  componentDidMount(){
    this.getCompanyTickersAndNames()
  }

  getCompanyTickersAndNames = () => {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
      .then( (response) => {
        this.setState({companyTickersAndNames:response.data})
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
      })
  }

  searchbarSearch = (event) => {
    //hide suggestions if user hits escape
    if(event.keyCode===27){
      this.hideSuggestions()
    }else{
      const input = event.target.value
      let searchbarSuggestions = this.searchbarSuggestionsGenerator(input, this.state.companyTickersAndNames)
      this.setState({searchbarSuggestions:searchbarSuggestions})
    }
  }

  searchbarSuggestionsGenerator = (input, companyList) => {
    const fuseOptions = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "name",
        "symbol"
      ]
    }
    const fuse = new Fuse(companyList, fuseOptions); // "list" is the item array
    let fuzzySearchResults = fuse.search(input)
    //top 5 results only
    fuzzySearchResults.length = 5
    return fuzzySearchResults
  }

  selectSuggestion = (event) => {
    let targetTicker = event.target.getAttribute("ticker")
    let targetName = event.target.getAttribute("name")
    this.setState(
      {
        targetTicker: targetTicker,
        targetName: targetName,
        searchbarSuggestions: [],
      }, this.chartNewData(targetTicker, targetName, this.state.timeRange)
    )
  }

  isSuggestionsActive = () => {
    if(this.state.searchbarSuggestions.length>0){
      return 'visible'
    }else{
      return 'hidden'
    }
  }
  hideSuggestions = (event) => {
    this.setState({
      searchbarSuggestions: [],
    })
  }

  render() {
    return (
      <div className="searchbar">
        <input className="searchbar-input" type="text" placeholder="Company" onKeyUp = {this.searchbarSearch} onBlur = {this.hideSuggestions} />
        <div className={`searchbar-suggestions ${this.isSuggestionsActive()}`}>
          {this.state.searchbarSuggestions.map((suggestion, index)=>{
            return <Suggestion suggestion = {suggestion} key = {index} selectTargetCompany = {this.props.selectTargetCompany} />
          }) }
        </div>
      </div>

    );
  }

}

export default Searchbar;