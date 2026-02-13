import React from 'react'
import './Playlist.css'
import Tracklist from '../Tracklist/Tracklist.jsx'

function Playlist({ playlistName, setPlaylistName, playlist, onRemove, onSave }) {
  return (
    <div className="Playlist">
      <h2 id="playlist-title">Playlist</h2>
      <div className="PlaylistNameContainer">
        <input
          id="playlist-name"
          type="text"
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button
          id="playlist-save"
          type="button"
          onClick={onSave}
          disabled={!playlistName.trim() || playlist.length === 0}
        >
          SAVE TO SPOTIFY
        </button>
      </div>
      <div className="PlaylistTracksContainer">
        <Tracklist tracks={playlist} onRemove={onRemove} />
      </div>
    </div>
  )
}

export default Playlist
