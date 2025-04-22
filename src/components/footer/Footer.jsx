import React from 'react'
import './Footer.css'

const Footer = () => {
    const date = new Date()
  return (
    <div className='footer'>
        <p>Homie. All rights Received&copy;{ date.getFullYear() } </p>
    </div>
  )
}

export default Footer