import React, { Component } from 'react';

//redux
import { connect } from "react-redux"
import { selectTargetCompany } from "../js/actions/index"

const mapDispatchToProps = dispatch => {
  return {
    selectTargetCompany: targetCompany => dispatch(selectTargetCompany(targetCompany)),
  };
};

const mapStateToProps = state => {
  return {
    targetCompany: state.targetCompany
  };
};

class ConnectedSuggestion extends Component {

  clickSuggestion = event =>{
    //reset article list
    const targetCompany = {
      name: event.target.getAttribute("name"),
      symbol: event.target.getAttribute("ticker")
    }
    this.props.selectTargetCompany(targetCompany)
    //reset suggestion list
  }

  // selectTargetCompany = (event) => {
  //   // console.log('run')
  //   this.setState({articleList:[]})
  //   let targetTicker = event.target.getAttribute("ticker")
  //   let targetName = event.target.getAttribute("name")
  //   this.setState(
  //     {
  //       targetCompany:{
  //         name: targetName,
  //         ticker: targetTicker
  //       },
  //       searchbarSuggestions: [],
  //     }, this.chartNewData(targetTicker, targetName, this.state.timeRange)
  //   )
  // }


  render() {
    return (
      <div className="searchbar-suggestion"
           ticker={this.props.suggestion.symbol}
           name={this.props.suggestion.name}
           onMouseDown={this.clickSuggestion} >
        {this.props.suggestion.name} ({this.props.suggestion.symbol})
      </div>

    );
  }

}

const Suggestion = connect(mapStateToProps, mapDispatchToProps)(ConnectedSuggestion)
export default Suggestion;