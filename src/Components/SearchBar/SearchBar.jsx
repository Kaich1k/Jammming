import React, { useState, useEffect } from 'react'
import App from '../App/App.jsx';
import './SearchBar.css'

function SearchBar({text, setText}) {

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSearch = () => {  
    setText('');
  }

  return (
    <div className="SearchBar">
      <input className="SearchBarInput" type="text" placeholder="Enter A Song, Album, or Artist" onChange={handleChange} value={text}/>
      <button className="SearchButton" onClick={handleSearch}>SEARCH</button>
    </div>
  )
}

export default SearchBar