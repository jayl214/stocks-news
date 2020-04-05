import React from 'react';

const ArticleItem = ({
  url,
  headline,
  snippet,
}) => {
  return (
    <li className="article-item">
      <a target="_blank" href={url}>
        <h4 className="headline">{headline}</h4>
        <p className="snippet">{snippet}</p>
      </a>
    </li>
  )
}

export default ArticleItem;