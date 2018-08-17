import React, { Component } from 'react';
import ArticleItem from './ArticleItem.jsx'

class ArticleList extends Component {

  render() {
    return (
      <div>
        <ul className="article-list">
          {this.props.articleList.map((articleItem, index)=>{
            return <ArticleItem articleItem = {articleItem} key = {index} />
          }) }
        </ul>

      </div>
    )
  }

}

export default ArticleList;