import React from 'react'
import './SearchBar.css'

function SearchBar({ searchQuery, setSearchQuery, onSearch }) {
  const handleChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div className="SearchBar">
      <input
        className="SearchBarInput"
        type="text"
        placeholder="Enter a song, album, or artist"
        onChange={handleChange}
        value={searchQuery}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
      />
      <button type="button" className="SearchButton" onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  )
}

export default SearchBar
