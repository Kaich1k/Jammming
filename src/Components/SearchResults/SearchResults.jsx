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
/*// 
// Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
const token = 'BQCmFcZVosxGwGAiMgG0F2rhE5oIKVnL3Y8bJyzfQgbwzCjirBIkIf09ImJvaEoVKJHaKZgJZqtNlR3QWF3giBphnGmjHM1dvC7hieJkzW5ozdOnCr_ICUpjxx7fPP9IiDShP-hmUDaMKPxRVhbX7rbvdOUofpY9GZrS3sGWq_XFpNqSbFxJSKvGMfGwklgbdP1shsgHSrMMcAioCvxwwIrwB7weuU8_7QxCJnp-gvc0QCvJ_a__E5nU7BVZ3O8nH9ky1UDsVvzK-tBd729uOvLe-h7jBf0WFghrot8k_yAYv3CMZlemrMOsNLKau-SNxtedP9ca';
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks(){
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
)*/
