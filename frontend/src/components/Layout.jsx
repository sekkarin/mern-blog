/* eslint-disable no-unused-vars */
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export const Layout = () => {
  return (
    <main className='bg-neutral-50 h-full'>
      <Header />
      <Outlet />
    </main>
  )
}

export default Layout;