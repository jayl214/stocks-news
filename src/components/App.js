import React, { Component, useState, useEffect } from 'react';
import axios from 'axios'
// import Fuse from 'fuse.js'
import Chart from 'chart.js'
import { of } from 'await-of';
import Searchbar from './Searchbar'
import Graph from './Graph'
import TimeRangeButtons from './TimeRangeButtons'
import ArticleList from './ArticleList'

import '../styles/css/app.css';

// const FUSE_OPTIONS = {
//   shouldSort: true,
//   threshold: 1,
//   location: 0,
//   distance: 100,
//   maxPatternLength: 1000,
//   minMatchCharLength: 1,
//   keys: [
//     "headline",
//     "snippet"
//   ]
// }

const _onFormatDate = (date = {}) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return year+month+day
}

const _onGetClickDateRange = (date = {}) => {
  let yesterday = new Date(date)
  let tomorrow = new Date(date)
  yesterday.setDate(yesterday.getDate()+1)
  tomorrow.setDate(tomorrow.getDate()+2)
  let output = {
    beginDate: _onFormatDate(yesterday),
    endDate: _onFormatDate(tomorrow),
  }
  return output
}

// called from news api
// const _onSortNewsArticles = (allArticles, searchParameters) =>{
//   const fuse = new Fuse(allArticles, FUSE_OPTIONS); // "list" is the item array
//   return fuse.search(searchParameters)
// }

const App = () => {

  const [targetCompany, setTargetCompany] = useState({
    name: "",
    ticker: ""
  });
  const [timeRange, setTimeRange] = useState("1m")
  const [articleList, setArticleList] = useState([])
  const [chartInstance, setChartInstance] = useState({})

  const _onChartNewData = async (ticker, name, timeRange) => {
    const [response = {}, error] = await of(axios.get(`https://sandbox.iexapis.com/stable/stock/${ticker}/chart/${timeRange}`, {
      params: {token:'Tpk_45fa2d540dac43b1b2f4b74ffbf64b68'}
    }))
    if (error) {
      window.alert("Error retrieving stock data");
      console.log(error);
      throw error
    }
    
    const stockDataPoints = response?.data || [];

    if (chartInstance.destroy) {
      chartInstance.destroy()
    }
  
    _onGenerateChart(name, stockDataPoints)      
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
  const _onSetNewsArticlesState = async (clickedPointDate) =>{
    const date = new Date(clickedPointDate)
    const clickDateRange = _onGetClickDateRange(date)
    clickedPointDate = clickedPointDate.replace(/-/g, '')

    const [response = {}, error] = await of(axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${'ZGFwwwPg4vmKWQqTORXT4LYAEaK56e34'}&q=${targetCompany.name}&begin_date=${clickDateRange.beginDate}&end_date=${clickDateRange.endDate}&fl=web_url%2Csnippet%2Clead_paragraph%2Cabstract%2Cheadline%2Ckeywords%2Cpub_date%2Ctype_of_material`))
    const responseArticleList = response.data?.response?.docs?.map?.((article={}) => ({
      headline: article.headline.main,
      snippet: article.snippet,
      pubDate: article.pub_date,
      url: article.web_url,
    }));
    if (error) {
      window.alert("Error retrieving articles");
      console.log(error);
      throw error
    }
    setArticleList(responseArticleList)
  }

  const _onGenerateChart = (name, stockDataPoints) => {
    const dates = stockDataPoints.map((stockDataPoint = {}) => stockDataPoint.date)
    const stockClosingValues = stockDataPoints.map((stockDataPoint = {}) => stockDataPoint.close)
    const ctx = document.getElementById('stockChart')
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: name,
                borderColor: 'rgba(255,236,0,1)',
                data: stockClosingValues,
                radius: 0,
                pointHoverRadius : 5,
                lineTension:0
            }]
        },
        options: {
          onClick: function(event = {}){
            const clickedPoint = this.getElementsAtXAxis(event)
            const clickedPointIndex = clickedPoint?.[0]?._index;
            const clickedPointDate = dates?.[clickedPointIndex];
            _onSetNewsArticlesState(clickedPointDate)
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
                return targetCompany.ticker + ': ' + Number(tooltipItem.yLabel)+" Click to get news";
              }
            }
          },
          maintainAspectRatio: false,
          // tooltips: {
          //   mode: 'nearest',
          // }
        }
    });
    //keep instance of chart in state so can access in other functions (deleting in destroyPreviousChart() )
    setChartInstance(chart);
  }

  const _onSelectTargetCompany = (event = {}) => {
    setArticleList([]);
    const ticker = event.target?.getAttribute?.("ticker");
    const name = event.target?.getAttribute?.("name");
    setTargetCompany({
      name,
      ticker
    })
    _onChartNewData(ticker, name, timeRange)
  }

  const _onSelectTimeRange = (newTimeRange) => {
    setArticleList([]);
    setTimeRange(newTimeRange)
    _onChartNewData(targetCompany.ticker, targetCompany.name, newTimeRange)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header__title">
          Stocks-News
        </h1>
        <Searchbar onSelectTargetCompany = {_onSelectTargetCompany} />
      </header>
      <TimeRangeButtons onSelectTimeRange = {_onSelectTimeRange} timeRange = {timeRange} />
      <p className="iex-blurb">
        Stock data provided for free by <a href="https://iextrading.com/developer/">IEX</a>. View <a href="https://iextrading.com/api-exhibit-a/">IEX’s Terms of Use</a>.
      </p>
      <Graph
        companyName={targetCompany.name}
      />
      <ArticleList articleList = {articleList} />
    </div>
  )
}

export default App;
