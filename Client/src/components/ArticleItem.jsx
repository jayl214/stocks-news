import React, { Component } from 'react';

class ArticleItem extends Component {

  render() {
    let articleItem = this.props.articleItem
    return (
      <li className="article-item">
        <a target="_blank" href={articleItem.url}>
          <h4 className="headline">{articleItem.headline}</h4>
          <p className="snippet">{articleItem.snippet}</p>
        </a>
      </li>
    )
  }

}

export default ArticleItem;