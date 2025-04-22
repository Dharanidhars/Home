import React, { useState } from 'react'
import './Review.css'

const Review = () => {

  const reviews = [
    {
      id:1,
      name:"Sarah M",
      message:"I found my dream apartment in less than a day. Homie is a game changer!"
    },
    {
      id:2,
      name: "Adeel R",
      message:"So easy to use, and every listing felt trustworthy."
    },
    {
      id:3,
      name: "Sangeetha V",
      message:"Homie made the entire rental process so easy. I found a place I loved, scheduled a visit, and signed the lease—all in one week!"
    }
  ]
  
  return (
    <div className='reviews'>
      <h1>Happy Customers</h1>
      <div className='customerReview'>
        { reviews.map((item,index)=>(
          <div className='customers' key={index}>
            <p className='reviewMessage'>"{item.message}"</p>
            <h2 className='costomersName'>{item.name}</h2>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Review