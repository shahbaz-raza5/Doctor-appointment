import React from 'react'
import { Spin } from 'antd';
const Spinner = () => {
  return (
    <div className='h-screen flex justify-center items-center md:z-50'>
    <Spin/>
    </div>
  )
}

export default Spinner