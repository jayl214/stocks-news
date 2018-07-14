import React, { Component } from 'react';
import logo from './logo.svg';
import Searchbar from './Searchbar.jsx'
import axios from 'axios'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      companyTickersAndNames: [],
      searchbarSuggestions: [],
      selectedCompany: {}
    }

  }

  componentDidMount() {
    this.getCompanyTickersAndNames()
  }

  getCompanyTickersAndNames = () => {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
      .then( (response) => {
        this.setState({companyTickersAndNames:response.data})
        console.log(this.state.companyTickersAndNames);
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
      })
  }

  searchbarSuggestionsGenerator = (input, companyList) => {
    const inputValue = input.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : companyList.filter(company =>
      company.name.toLowerCase().includes(inputValue)
    );
  }

  searchbarSearch = (event) => {
    const input = event.target.value
    let searchbarSuggestions = this.searchbarSuggestionsGenerator(input, this.state.companyTickersAndNames)
    searchbarSuggestions.length = 5
    this.setState({searchbarSuggestions:searchbarSuggestions})
    console.log(searchbarSuggestions)
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Searchbar searchbarSearch = {this.searchbarSearch} searchbarSuggestions = {this.state.searchbarSuggestions} />
      </div>
    )
  }
}

export default App;
