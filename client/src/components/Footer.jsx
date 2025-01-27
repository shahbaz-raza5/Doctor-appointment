import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-200 to-blue-400 border-blue-600 border-opacity-25 transition-all mt-24">
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex justify-center text-teal-600 sm:justify-start">         
        </div>
        <p className="mt-4 text-center text-sm text-white lg:mt-0 lg:text-right">
          Copyright &copy; 2024. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
  )
}

export default Footer