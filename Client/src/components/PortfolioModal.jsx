import React, { Component } from 'react';

import Welcome from './Welcome'
import PortfolioItem from './PortfolioItem'

class PortfolioModal extends Component {

  render() {
    console.log(this.props.userData.portfolio)
    return (
      <div className = {`portfolio-modal ${this.props.portfolioModalStatus}`}>

        <div className="content">
          <Welcome userData = {this.props.userData} />
          <h3>Your Portfolio:</h3>
          <div className="portfolio-list">
            <div className="portfolio-list__item">
            {
              this.props.userData.portfolio.map((company, index) => {
              return <PortfolioItem company = {company} key = {index} selectTargetCompany = {this.props.selectTargetCompany} />})
            }
            </div>
          </div>
          <button className = "logout-button" onClick={this.props.logout}>Log out</button>
        </div>

      </div>
    )
  }

}

export default PortfolioModal;