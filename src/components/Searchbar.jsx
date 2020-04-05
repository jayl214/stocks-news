import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Fuse from 'fuse.js'
import Suggestion from './Suggestion.jsx'
import { of } from 'await-of';

const ESCAPE_BUTTON_KEYCODE = 27

const FUSE_OPTIONS = {
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

const Searchbar = ({
  onSelectTargetCompany
}) => {

  const [searchbarSuggestions, setSearchbarSuggestions] = useState([]);
  const [companyTickersAndNamesFuzzySearch, setCompanyTickersAndNamesFuzzySearch] = useState({});

  useEffect(() => {
    _onGetCompanyTickersAndNames()
  }, []);

  const _onGetCompanyTickersAndNames = async () => {
    const [response = {}, error] = await of(axios.get('https://api.iextrading.com/1.0/ref-data/symbols'));
    if (error) {
      console.log(error);
      throw error;
    }
    const {data: companyTickersAndNamesList = []} = response;
    setCompanyTickersAndNamesFuzzySearch(new Fuse(companyTickersAndNamesList, FUSE_OPTIONS));
  }

  const _onSearchbarKeyUp = (event = {}) => {
    //hide suggestions if user hits escape
    if(event.keyCode === ESCAPE_BUTTON_KEYCODE){
      _onResetSearchbarSuggestions()
      return;
    }
    const input = event.target?.value;
    const searchbarSuggestions = _onGenerateSearchbarSuggestions(input);
    setSearchbarSuggestions(searchbarSuggestions);
  }

  const _onGenerateSearchbarSuggestions = (input) => {
    const fuzzySearchResults = companyTickersAndNamesFuzzySearch.search?.(input);
    return fuzzySearchResults.length > 5 ? fuzzySearchResults.slice(0, 4) : fuzzySearchResults;
  }

  const _onResetSearchbarSuggestions = () => setSearchbarSuggestions([])

  return (
    <div className="searchbar">
      <input
        className="searchbar-input"
        type="text"
        placeholder="Search a Stock"
        onKeyUp = {_onSearchbarKeyUp}
        onBlur = {_onResetSearchbarSuggestions}
      />
      <i className="fas fa-search" />
      <div className={`searchbar-suggestions ${!!searchbarSuggestions.length ? 'visible' : 'hidden'}`}>
        {searchbarSuggestions.map((suggestion={}, index) => 
          <Suggestion
            key={index}  
            name={suggestion.name}
            symbol={suggestion.symbol}
            onSelectTargetCompany={onSelectTargetCompany}
          />
        )}
      </div>
    </div>

  );

}

export default Searchbar;