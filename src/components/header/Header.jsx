import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-scroll'
import './Header.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Signin from '../signin/Signin'

const Header = () => {
  return (
    <div className='header' id='header'>
        <div className="left">
        <img src={logo} alt="logo" />
        <h1>Homie</h1>
        </div>
        <div className="right">
          <Router>
            <Link to='#home' offset={100} scrolling='smooth' >Home</Link>
            <Link to='#about' offset={100} scrolling='smooth'>About</Link>
            <Link to='#contact' offset={100} scrolling='smooth'>Contact</Link>
            <Link to='/signin'>Sign in</Link>
            <Routes>
              <Route path='/signin' element={<Signin />} />
            </Routes>
          </Router>
        </div>
    </div>
  )
}

export default Header