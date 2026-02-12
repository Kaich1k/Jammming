import React,{ useState, useEffect } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import Playlist from '../Playlist/Playlist.jsx'
import Tracklist from '../Tracklist/Tracklist.jsx'
import Track from '../Track/Track.jsx'

function App() {

  const [searchResults, setSearchResults] = useState('');
  const [playlist, setPlaylist] = useState([]);

  return (
    <div className="App">
      <h1 id="title">Jammming</h1>
      <p id="description">Search for songs and add them to your playlist!</p>
      <SearchBar className="SearchBar" text={searchResults} setText={setSearchResults}/>
      <div className="BodyContentContainer">
        <SearchResults className="SearchResults" text={searchResults}/>
        <Playlist className="Playlist"/>
      </div>
    </div>
  )
}

export default App;