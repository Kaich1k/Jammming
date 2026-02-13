import React, { useState, useEffect } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import Playlist from '../Playlist/Playlist.jsx'
import * as Spotify from '../../spotify.js'

function App() {
  const [token, setToken] = useState(Spotify.getStoredToken())
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [playlistName, setPlaylistName] = useState('')

  useEffect(() => {
    if (token) return
    Spotify.getTokenFromUrl().then((newToken) => {
      if (newToken) {
        Spotify.setStoredToken(newToken)
        setToken(newToken)
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash)
      }
    })
  }, [token])

  const handleSearch = async () => {
    if (!token || !searchQuery.trim()) return
    const data = await Spotify.searchTracks(token, searchQuery)
    if (data._unauthorized) {
      Spotify.setStoredToken(null)
      setToken(null)
      return
    }
    setSearchResults(data.tracks?.items ?? [])
  }

  const addTrack = (track) => {
    if (playlist.some((t) => t.id === track.id)) return
    setPlaylist((prev) => [...prev, track])
  }

  const removeTrack = (trackId) => {
    setPlaylist((prev) => prev.filter((t) => t.id !== trackId))
  }

  const savePlaylist = async () => {
    if (!token || !playlistName.trim() || playlist.length === 0) return
    const me = await Spotify.getMe(token)
    if (me._unauthorized || !me.id) {
      Spotify.setStoredToken(null)
      setToken(null)
      return
    }
    const pl = await Spotify.createPlaylist(token, me.id, playlistName.trim())
    if (pl._unauthorized || !pl.id) return
    const uris = playlist.map((t) => t.uri)
    await Spotify.addTracksToPlaylist(token, pl.id, uris)
    setPlaylist([])
    setPlaylistName('')
  }

  const handleLogout = () => {
    Spotify.logout()
    setToken(null)
    setSearchResults([])
    setPlaylist([])
  }

  return (
    <div className="App">
      <h1 id="title">Jammming</h1>
      <p id="description">Search for songs and add them to your playlist!</p>
      {token ? (
        <>
          <button type="button" onClick={handleLogout} className="LogoutButton">
            Log out from Spotify
          </button>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
          <div className="BodyContentContainer">
            <SearchResults
              tracks={searchResults}
              onAdd={addTrack}
              playlist={playlist}
            />
            <Playlist
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              playlist={playlist}
              onRemove={removeTrack}
              onSave={savePlaylist}
            />
          </div>
        </>
      ) : (
        <div className="LoginScreen">
          <button type="button" onClick={Spotify.login} className="LoginButton">
            Log in with Spotify
          </button>
        </div>
      )}
    </div>
  )
}

export default App
