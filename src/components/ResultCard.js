import React from 'react';

const ReactCard = ({result}) => {
    
    console.log(result.snippet.thumbnails.medium);
    
    return (
        <div class="container">
          <section class="cards">
            <article class="card card--1">
              <div class="card__info-hover">
                <svg class="card__like"  viewBox="0 0 24 24"></svg>
                  <div class="card__clock-info">
                    <svg class="card__clock"  viewBox="0 0 24 24">
                    </svg><span class="card__time">15 min</span>
                  </div>
              </div>
              <div class="card__img" style={{backgroundImage: `url(${result.snippet.thumbnails.high.url})`}}></div>
              <a href="#" class="card_link">
                 <div class="card__img--hover" style={{backgroundImage: `url(${result.snippet.thumbnails.high.url})`}}></div>
               </a>
              <div class="card__info">
                <span class="card__category">{result.snippet.title}</span>
                <h3 class="card__title">{result.snippet.title}</h3>
                <span class="card__by">by <a href="#" class="card__author" title="author">{result.snippet.channelTitle}</a></span>
              </div>
            </article>
          </section>
        </div>
    );
}

export default ReactCard;