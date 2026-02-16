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
    if (!token || !playlistName.trim() || playlist.length === 0) {
      if (!playlistName.trim()) alert('Enter a playlist name.')
      else if (playlist.length === 0) alert('Add at least one track to your playlist.')
      return
    }
    try {
      const me = await Spotify.getMe(token)
      if (me._unauthorized || !me.id) {
        Spotify.setStoredToken(null)
        setToken(null)
        alert('Session expired. Please log in again.')
        return
      }
      const pl = await Spotify.createPlaylist(token, me.id, playlistName.trim())
      if (pl._forbidden) {
        console.error('Spotify 403 create playlist – full response:', pl._error)
        const accountHint = me.email
          ? "Add this email in Dashboard → your app → User management:\n" + me.email
          : "Add your Spotify account email in Dashboard → your app → User management (same email you use to log in here)."
        alert(
          "Can't create playlist (403).\n\n" +
          accountHint + "\n\n" +
          "Then Save in the Dashboard, log out here, and Log in with Spotify again."
        )
        return
      }
      if (pl._unauthorized || !pl.id) {
        const msg = pl?.error?.message || pl?.error?.status || 'Could not create playlist.'
        alert('Failed to create playlist: ' + msg)
        return
      }
      const uris = playlist.map((t) => t.uri).filter(Boolean)
      if (!uris.length) {
        alert('No valid tracks to add.')
        return
      }
      const addResult = await Spotify.addTracksToPlaylist(token, pl.id, uris)
      if (addResult && addResult._forbidden) {
        const spotifyMsg = addResult._error?.error?.message || addResult._error?.message || JSON.stringify(addResult._error || '')
        console.error('Spotify 403 on add tracks:', addResult._error)
        alert(
          'Forbidden when adding tracks. Spotify says: ' + (spotifyMsg || 'Unknown') + '\n\nCheck: Premium on app owner account, your email in Dashboard → User management, then log out and log in again.'
        )
        return
      }
      if (addResult && addResult._unauthorized) {
        alert('Session expired. Please log in again.')
        return
      }
      setPlaylist([])
      setPlaylistName('')
      alert(`Playlist "${playlistName}" saved to your Spotify!`)
    } catch (err) {
      console.error('Save playlist error', err)
      alert('Something went wrong: ' + (err.message || 'Try again.'))
    }
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
      {console.log(token)}
    </div>
  )
}

export default App
