import React, { useState, useEffect } from 'react'
import './SearchResults.css'

function SearchResults({text}) {

    const getSearchResults = () => {
        const searchResults = [];
        searchResults.push({name: 'Song 1', artist: 'Artist 1', album: 'Album 1'});
        searchResults.push({name: 'Song 2', artist: 'Artist 2', album: 'Album 2'});
        searchResults.push({name: 'Song 3', artist: 'Artist 3', album: 'Album 3'});
        return searchResults;
    }

    return (
    <div className="SearchResults">
      <h2 id="search-results-title">Search Results</h2>
      <div className="SearchResultsList">
        {getSearchResults().map((item) => (
          <div className="SearchResultsItem">
            <h3>{item.name}</h3>
            <p>{item.artist}</p>
            <p>{item.album}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults