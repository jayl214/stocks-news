import React, { Component } from 'react';
import axios from 'axios' //promise based ajax
import Fuse from 'fuse.js' //fuzzy searcher
import Chart from 'chart.js' //duh

import '../styles/css/app.css';

//React components
import Navbar from './Navbar'
import LoginModal from './LoginModal'
import Searchbar from './Searchbar'
import Graph from './Graph'
import TimeRangeButtons from './TimeRangeButtons'
import ArticleList from './ArticleList'
import InstructionsModal from './InstructionsModal'

class App extends Component {

  state = {
    targetCompany:{
      name: '',
      ticker: ''
    },
    timeRange: '1m',
    articleList: [],
    userName: '',
    userData: {
      name: '',
      portfolio: ''
    },
    loginModalStatus: false,
    // appjs: this
    // chartInstance: {},
  }

  componentDidMount = () =>{
    if(document.cookie){
      this.setState({
        jwt: document.cookie.slice(5)
      })
      this.getUserData()
    }
  }

  getUserData = () => {
    axios.get('api/v1/user', {headers:{
      Authorization: document.cookie.slice(5)
    }})
    .then((response)=>{
      console.log(response)
      this.setState({
        userData: {
          name: response.data.name,
          portfolio: response.data.companies
        }
      })
    })
  }

  chartNewData = (ticker, name, timeRange) => {
    axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/${timeRange}`)
      .then( (response) => {
        let stockValues = []
        let dates = []
        response.data.forEach((day) => {
          dates.push(day.date)
          stockValues.push(day.close)
        })
        //need to destroy previous chart before making a new one, or will have bug where old graph pops up
        this.destroyPreviousChart()
        this.generateChart(dates, name, stockValues)
      })
      .catch( (error) => {
        window.alert("Error retrieving stock data");
        console.log(error);
      })
  }

  //selects instance of chart at id.= stockChart and utterly destroys it
  destroyPreviousChart = () => {
    if (this.state.chartInstance) {
      this.state.chartInstance.destroy()
    }
  }

  //called in setNewsArticlesState
  sortNewsArticles = (allArticles, searchParameters) =>{
    const fuseOptions = {
      shouldSort: true,
      threshold: 1,
      location: 0,
      distance: 100,
      maxPatternLength: 1000,
      minMatchCharLength: 1,
      keys: [
        "headline",
        "snippet"
      ]
    }
    const fuse = new Fuse(allArticles, fuseOptions); // "list" is the item array
    return fuse.search(searchParameters)
  }

  // News API
  // called in generateChart -> chart.options.onclick
  // setNewsArticlesState = (clickedPointDate) => {
  //   console.log(process.env.REACT_APP_NEWS_API_KEY)
  //   axios.get(`https://newsapi.org/v2/everything?q=${this.state.targetCompany.name}&from=${clickedPointDate}&to=${clickedPointDate}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
  //     .then( (response) => {
  //       console.log(`https://newsapi.org/v2/everything?q=${this.state.targetCompany.name}&from=${clickedPointDate}&to=${clickedPointDate}&sortBy=popularity&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`)
  //       this.setState({articleList:this.sortNewsArticles(response.data.docs, this.state.targetCompany.name)})
  //     })
  //     .catch( (error) => {
  //       // handle error
  //       console.log(error);
  //     })
  // }

  //NY Times API
  setNewsArticlesState = (clickedPointDate) =>{
    console.log(clickedPointDate)
    const date = new Date(clickedPointDate)
    const dateRange = this.setDateRange(date)
    clickedPointDate = clickedPointDate.replace(/-/g, '')
    let clickedPointDateTomorrow = (parseInt(clickedPointDate)+1).toString()
    axios.get(`https://developer.nytimes.com/proxy/https/api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NYT_API_KEY}&q=${this.state.targetCompany.name+' shares stocks'}&begin_date=${dateRange.beginDate}&end_date=${dateRange.endDate}&fl=web_url%2Csnippet%2Clead_paragraph%2Cabstract%2Cheadline%2Ckeywords%2Cpub_date%2Ctype_of_material`)
      .then( (response) => {
        console.log(response.data.response.docs)
        let articleList = []
        response.data.response.docs.forEach((article)=>{
          articleList.push({
            headline: article.headline.main,
            snippet: article.snippet,
            pubDate: article.pub_date,
            url: article.web_url,
          })
        })
        // let sortedArticleList = this.sortNewsArticles(articleList, this.state.targetCompany.name+' shares stocks')
        this.setState({articleList:articleList})
      })
      .catch( (error) => {
        // handle error
        window.alert("Error retrieving articles");
        console.log(error);
      })
  }

  formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return year+month+day
  }

  setDateRange = (date) => {
    let yesterday = new Date(date)
    let tomorrow = new Date(date)
    yesterday.setDate(yesterday.getDate()+1)
    tomorrow.setDate(tomorrow.getDate()+2)
    let output = {
      beginDate: this.formatDate(yesterday),
      endDate: this.formatDate(tomorrow),
    }
    console.log(output)
    return output
  }

  generateChart = (dates, name, stockValues) => {
    let appjs = this //for calling React functions like setState in onClick
    const ctx = document.getElementById('stockChart')
    const chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: dates,
            datasets: [{
                label: name,
                borderColor: 'rgba(255,236,0,1)',
                data: stockValues,
                radius: 0,
                pointHoverRadius : 5,
                lineTension:0
            }]
        },
        // Configuration options go here
        options: {
          onClick: function (event){
            let clickedPoint = this.getElementsAtXAxis(event)
            if (clickedPoint.length > 0){
              let clickedPointIndex = clickedPoint[0]._index
              let clickedPointDate = dates[clickedPointIndex]
              appjs.setNewsArticlesState(clickedPointDate)
            }
          },
          legend:{
            display:false,
          },
          hover:{
            mode: 'index',
            intersect: false,
          },
          tooltips:{
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return appjs.state.targetCompany.ticker + ': ' + Number(tooltipItem.yLabel)+" Click to get news";
              }
            }
          },
          maintainAspectRatio: false,
          // tooltips: {
          //   mode: 'nearest',
          // }
        }
    })
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    this.setState({chartInstance: chart})
  }

  selectTargetCompany = (event) => {
    this.setState({articleList:[]})
    let targetTicker = event.target.getAttribute("ticker")
    let targetName = event.target.getAttribute("name")
    this.setState(
      {
        targetCompany:{
          name: targetName,
          ticker: targetTicker
        },
        searchbarSuggestions: [],
      }, this.chartNewData(targetTicker, targetName, this.state.timeRange)
    )
  }

  selectTimeRange = (event) => {
    this.setState({articleList:[]})
    let timeRange = event.target.getAttribute("name")
    this.setState(
      {
        timeRange: timeRange
      }, this.chartNewData(this.state.targetCompany.ticker, this.state.targetCompany.name, timeRange)
    )
  }

  addCompanyToPortfolio = e =>{
    axios.post("api/v1/add_company",{
      name: this.state.targetCompany.name,
      symbol: this.state.targetCompany.ticker
    },{headers:{
      Authorization: this.state.jwt
    }})
    .then((response)=>{
      console.log(response)
      this.getUserData()
    })
  }

  toggleLoginModalStatus = () => {
    return (this.state.loginModalStatus ? this.setState({loginModalStatus:false}) : this.setState({loginModalStatus:true}) )
  }

  hideLoginModal = () => {
    return this.setState({loginModalStatus:false})
  }

  submitLoginForm = e =>{
    e.preventDefault()
    axios.post("api/v1/auth/login", {
      email: this.state.loginEmail,
      password: this.state.loginPassword
    })
    .then( (response) => {
      document.cookie = `Auth=${response.data.access_token}`

      this.getUserData()
      this.setState({
        jwt: document.cookie.slice(5)
      })
      alert(document.cookie)
      console.log(response.data)
    })
    .catch( (error) => {
      window.alert("Login Error");
      console.log(error);
    })
  }

  submitRegisterForm = e =>{
    e.preventDefault()
    axios.post("api/v1/auth/register", {
      name: this.state.registerName,
      email: this.state.registerEmail,
      password: this.state.registerPassword
    })
    .then( (response) => {
      console.log(response.data)
    })
    .catch( (error) => {
      window.alert("Registration Error");
      console.log(error);
    })
  }
  handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <div className="app">
        <Navbar
          toggleLoginModalStatus = {this.toggleLoginModalStatus}
          loginModalStatus = {this.state.loginModalStatus}
          getUserData={this.getUserData}
        />
        {/*<LoginModal registerModalStatus={this.state.registerModalStatus} />*/}
        {/*<header className="app-header">

          <div className={`modal-login ${this.state.loginModalStatus}`}>
            <h2>Login</h2>
            <form onSubmit={this.submitLoginForm}>
              <input
                name="loginEmail"
                type="email"
                placeholder="email..."
                value={this.state.loginEmail}
                onChange={this.handleInputChange}/>
              <input
                name="loginPassword"
                type="password"
                placeholder="password..."
                value={this.state.loginPassword}
                onChange={this.handleInputChange} />
              <button>Login</button>
            </form>
          </div>

          <div className={`modal-register ${this.state.registerModalStatus}`}>
            <h2>Register</h2>
            <form onSubmit={this.submitRegisterForm}>
              <input
                name="registerName"
                type="text"
                placeholder="name..."
                value={this.state.registerName}
                onChange={this.handleInputChange} />
              <input
                name="registerEmail"
                type="email"
                placeholder="email..."
                value={this.state.registerEmail}
                onChange={this.handleInputChange} />
              <input
                name="registerPassword"
                type="password"
                placeholder="password..."
                value={this.state.registerPassword}
                onChange={this.handleInputChange} />
              <button>Register</button>
            </form>
          </div>

        </header>*/}
        <div className = "content" onClick={this.hideLoginModal}>
          <Searchbar selectTargetCompany = {this.selectTargetCompany} userData = {this.state.userData} />
          <TimeRangeButtons selectTimeRange = {this.selectTimeRange} timeRange = {this.state.timeRange} />
          <p className="iex-blurb">
            Stock data provided for free by <a href="https://iextrading.com/developer/">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.
          </p>
          <Graph targetCompany = {this.state.targetCompany} addCompanyToPortfolio = {this.addCompanyToPortfolio} />
          <ArticleList articleList = {this.state.articleList} />
          {/*<InstructionsModal />*/}
        </div>
      </div>
    )
  }
}

export default App;
