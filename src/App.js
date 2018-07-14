import React, { Component } from 'react';
import logo from './logo.svg';
import Searchbar from './Searchbar.jsx'
import axios from 'axios'
import './App.css';

class App extends Component {

  constructor = (props) => {
    super(props)

    this.state = {
      tickersAndNames: [],
      searchBarInput: "",
      searchbarSuggestions: [],
    }

  }

  componentDidMount = () => {
    this.getTickersAndNames()
  }

  getTickersAndNames = () => {
    axios.get('https://api.iextrading.com/1.0/ref-data/symbols')
      .then( (response) => {
        this.state.tickersAndNames = response
        console.log(this.state.tickersAndNames);
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
    const input = event.target.value
    this.state.searchBarInput = input
    console.log(this.state.searchBarInput)
  }


  render = () => {
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
