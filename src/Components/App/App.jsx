import React,{ useState, useEffect } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import Playlist from '../Playlist/Playlist.jsx'
import Tracklist from '../Tracklist/Tracklist.jsx'
import Track from '../Track/Track.jsx'

function App() {

  return (
    <div className="App">
      <h1 id="title">Jammming</h1>
      <p id="description">Search for songs and add them to your playlist!</p>
      <SearchBar className="SearchBar"/>
      <div className="BodyContentContainer">
        <SearchResults className="SearchResults"/>
        <Playlist className="Playlist"/>
        <Tracklist className="Tracklist"/>
        <Track className="Track"/>
      </div>
    </div>
  )
}

export default App;