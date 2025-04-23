import React from 'react'
import './Contact.css'
import facebook from '../../assets/fb.png'
import instagram from '../../assets/insta.png'
import twitter from '../../assets/twitter.png'
import youtube from '../../assets/youtube.png'

const Contact = () => {
  return (
    <div className='contact' id='contact'>
        <h1 className='contactHeader'>Contact Us</h1>
        <div className='contactInputs'>
        <input type="text" placeholder='Enter your name' className='contactName' />
        <input type='email' placeholder='Enter your e-mail' className='contactEmail' />
        <textarea placeholder='Enter your Message' rows='10' ></textarea>
        <button>Submit</button>
        </div>

        <div className="socialMedia">
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={facebook} alt="facebook" className='fb' /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={instagram} alt="instagram" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={twitter} alt="twitter" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={youtube} alt="youtube" className='utube' /></a>
        </div>

    </div>
  )
}

export default Contact