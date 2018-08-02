import React, { Component } from 'react';
import axios from 'axios' //promise based ajax
import Fuse from 'fuse.js' //fuzzy searcher
import Chart from 'chart.js' //duh

import '../styles/css/app.css';

//React components
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
    targetTicker: '',
    targetName: '',
    timeRange: '1m',
    articleList: [],
    appjs: this
    // chartInstance: {},
  }

  chartNewData = (ticker, name, timeRange) => {
    axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/${timeRange}`)
      .then( (response) => {
        console.log(response.data)
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
        // handle error
        console.log(error);
      })
      .then( () =>{
        // always executed
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
      // threshold: .99,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
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
    axios.get(`https://developer.nytimes.com/proxy/https/api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NYT_API_KEY}&q=${this.state.targetCompany.name}&begin_date=${dateRange.beginDate}&end_date=${dateRange.endDate}&fl=web_url%2Csnippet%2Clead_paragraph%2Cabstract%2Cheadline%2Ckeywords%2Cpub_date%2Ctype_of_material`)
      .then( (response) => {
        console.log(`https://developer.nytimes.com/proxy/https/api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NYT_API_KEY}&q=${this.state.targetCompany.name}&begin_date=${dateRange.beginDate}&end_date=${dateRange.endDate}&fl=web_url%2Csnippet%2Clead_paragraph%2Cabstract%2Cheadline%2Ckeywords%2Cpub_date%2Ctype_of_material`)
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
        // this.setState({articleList:this.sortNewsArticles(articleList, this.state.targetCompany.name)})
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
    yesterday.setDate(yesterday.getDate()-0)
    console.log(yesterday)
    tomorrow.setDate(tomorrow.getDate()+2)
    console.log(tomorrow)
    let output = {
      beginDate: this.formatDate(yesterday),
      endDate: this.formatDate(tomorrow),
    }
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
                // backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: stockValues,
                radius: dates.map(element => element * 0)
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
          onHover: function(event){
            let hoverPoint = this.getElementsAtXAxis(event)
            let hoverPointIndex = hoverPoint[0]._index
            appjs.radiusSelect(this, hoverPointIndex, dates)
          },
          legend:{
            display:false
          },
        }
    })
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    this.setState({chartInstance: chart})
  }

  radiusSelect = (chart, index, dates) => {
    // console.log(index)
    let radiusArray = dates.map(element => element * 0)
    radiusArray[index] = 3
    chart.data.datasets[0].radius = radiusArray
    // chart.data.datasets[0].radius[index] = 3
    chart.update();
  }

  selectTargetCompany = (event) => {
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
    let timeRange = event.target.getAttribute("name")
    this.setState(
      {
        timeRange: timeRange
      }, this.chartNewData(this.state.targetCompany.ticker, this.state.targetCompany.name, timeRange)
    )
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-intro">
            Search a Company
          </h1>
          <Searchbar selectTargetCompany = {this.selectTargetCompany} />
        </header>

        <TimeRangeButtons selectTimeRange = {this.selectTimeRange} timeRange = {this.state.timeRange} />
        <Graph targetCompany = {this.state.targetCompany} />

        <ArticleList articleList = {this.state.articleList} />
        {/*<InstructionsModal />*/}
      </div>
    )
  }
}

export default App;
