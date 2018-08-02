import React, { Component } from 'react';

class ArticleItem extends Component {

  render() {
    let articleItem = this.props.articleItem
    return (
      <li>
        <h4>{articleItem.headline}</h4>
        <p>{articleItem.snippet}</p>
        <p>{articleItem.pubDate}</p>
        <a target="_blank" href={articleItem.url}>{articleItem.url}</a>
      </li>
    )
  }

}

export default ArticleItem;