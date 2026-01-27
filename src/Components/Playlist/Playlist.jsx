import React, { useState, useEffect } from 'react'
import './Playlist.css'
import Tracklist from '../Tracklist/Tracklist.jsx';

function Playlist() {
  return (
    <div className="Playlist">
      <h2 id="playlist-title">Playlist</h2>
      <div className="PlaylistNameContainer">
        <input id="playlist-name" type="text" placeholder="Enter Playlist Name" />
        <button id="playlist-save">SAVE TO SPOTIFY</button>
      </div>
      <div className="PlaylistTracksContainer">
        <Tracklist />
      </div>
    </div>
  )
}

export default Playlist