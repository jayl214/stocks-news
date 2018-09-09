import React, { Component } from 'react';

import Welcome from './Welcome'
import PortfolioItem from './PortfolioItem'

class PortfolioModal extends Component {

  render() {
    console.log(this.props.userData.portfolio)
    return (
      <div className = "portfolio-modal">
        <Welcome userData = {this.props.userData} />
        <button className = "logout-button" onClick={this.props.logout}>Log out</button>
        <div className="portfolio-list">
          <div className={`portfolio-list__item`}>
          {
            this.props.userData.portfolio.map((company, index) => {
            return <PortfolioItem company = {company} key = {index} selectTargetCompany = {this.props.selectTargetCompany} />})
          }
          </div>
        </div>
      </div>
    )
  }

}

export default PortfolioModal;