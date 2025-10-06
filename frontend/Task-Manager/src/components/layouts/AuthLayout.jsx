import React from 'react'
import authBackground from '../../assets/images/authBackground.jpg'

const AuthLayout = ({ children }) => {
  return (
    <div
      className="flex w-screen h-screen bg-cover bg-center justify-center"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <div className="w-screen 80vh md:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] 3xl:w-[40vw] bg-white/30 backdrop-blur-sm px-12 pt-8 pb-12 mt-10 mb-10">
        <h2 className="text-center text-3xl font-medium text-black">Priority Pulse</h2>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
