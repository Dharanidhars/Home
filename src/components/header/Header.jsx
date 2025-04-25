import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-scroll'
import './Header.css'
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
          <Link className='desktopMenu' > Signin </Link>
          
        </div>
    </div>
  )
}

export default Header