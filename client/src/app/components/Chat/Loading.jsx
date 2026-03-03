import React from 'react'
import LoadingIcons from 'react-loading-icons'
import 'react-loading-skeleton/dist/skeleton.css'

export const Loading = () => {
  return (
    <div className="d-flex flex-col justify-content-center  align-items-center"
    style={{
      flex: 1,
      overflowY: "auto",
      padding: "1rem",
      backgroundColor:"transparent",
      scrollbarWidth:"none"
    }}>
      <LoadingIcons.TailSpin />
      <h1 className='text-gray-600 text-xl font-bold' style={{fontSize:"30px"}}>Loading ....</h1></div>
  )
}
