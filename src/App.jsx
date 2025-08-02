import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { Outlet } from 'react-router-dom'
import Header from './components/custom/Header'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Toaster/>
    </>
  )
}

export default App
