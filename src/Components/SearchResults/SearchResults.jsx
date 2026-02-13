import React from 'react'
import './SearchResults.css'

function SearchResults({ tracks, onAdd, playlist }) {
  const inPlaylist = (id) => playlist.some((t) => t.id === id)

  return (
    <div className="SearchResults">
      <h2 id="search-results-title">Search Results</h2>
      <div className="SearchResultsList">
        {tracks.map((track) => (
          <div key={track.id} className="SearchResultsItem">
            <div className="TrackInfo">
              <h3>{track.name}</h3>
              <p>{track.artists?.map((a) => a.name).join(', ')}</p>
              <p>{track.album?.name}</p>
            </div>
            <button
              type="button"
              className="AddTrackButton"
              onClick={() => onAdd(track)}
              disabled={inPlaylist(track.id)}
            >
              {inPlaylist(track.id) ? 'Added' : '+'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchResults
