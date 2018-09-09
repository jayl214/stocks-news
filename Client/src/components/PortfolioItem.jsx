import React, { Component } from 'react';

class PortfolioItem extends Component {



  render() {
    return (
      <div className="searchbar-PortfolioItem"
           ticker={this.props.company.symbol}
           name={this.props.company.name}
           onMouseDown={this.props.selectTargetCompany} >
        {this.props.company.name} ({this.props.company.symbol})
      </div>

    );
  }

}

export default PortfolioItem;