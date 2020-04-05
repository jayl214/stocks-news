import React from 'react';
import ArticleItem from './ArticleItem.jsx'

const  ArticleList = ({articleList = []}) => {
  return(
    <div>
      <ul className="article-list">
        {articleList.map((articleItem = {}, index) => 
          <ArticleItem
            key={index}  
            url={articleItem.url}
            headline={articleItem.headline}
            snippet={articleItem.snippet}
          />
        )}
      </ul>
    </div>
  )
}

export default ArticleList;