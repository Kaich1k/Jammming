import React from 'react'
import './Tracklist.css'

function Tracklist({ tracks = [], onRemove }) {
  return (
    <div className="Tracklist" style={{ width: '100%', minWidth: '0' }}>
      {tracks.length === 0 ? (
        <p className="TracklistEmpty">No tracks yet. Search and add some!</p>
      ) : (
        tracks.map((track) => (
          <div key={track.id} className="TracklistItem">
            <div className="TrackInfo">
              <img src={track.album?.images[0]?.url} alt={track.name} style={{ width: '40px', height: '40px' }} className="TrackImage" />
              <div className="TrackInfoText">
                <h3>{track.name}</h3>
                <p>{track.artists?.map((a) => a.name).join(', ')} • {track.album?.name}</p>
              </div>
            </div>
            <button
              type="button"
              className="RemoveTrackButton"
              onClick={() => onRemove(track.id)}
              aria-label="Remove from playlist"
            >
              -
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Tracklist
