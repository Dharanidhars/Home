import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-scroll'
import './Header.css'
import { Links, Route, Router, Routes } from 'react-router-dom'
import Signin from '../signin/Signin'
const Header = () => {
  return (
    <div className='header' id='header'>
        <div className="left">
        <img src={logo} alt="logo" />
        <h1>Homie</h1>
        </div>
        <div className="right">

          <Link to='home' activeClass='activeNav' spy={true} smooth={true} offset={-100} duration={500} className='desktopMenu'  > Home </Link>
          <Link to='about' activeClass='activeNav' spy={true} smooth={true} offset={-50} duration={500} className='desktopMenu'  > About </Link>
          <Link to='contact' activeClass='activeNav' spy={true} smooth={true} offset={-50} duration={500} className='desktopMenu'  > Contact </Link>
          {/* <Links to='/signin' >Signin</Links>  */}
          {/* <Router>
            <Routes>
              <Route to='/signin' element={ <Signin />} />
            </Routes>
          </Router>  */}
          
        </div>
    </div>
  )
}

export default Header