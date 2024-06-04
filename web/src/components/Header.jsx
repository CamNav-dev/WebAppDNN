import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className='bg-slate-200'>
        <div className='container flex justify-between items-center
        max-w-6xl mx-auto p-3'>
            <Link to='/'>
            <h1 className='text-2xl font-bold'>DNN Web App</h1>
            </Link>
            <ul className='flex gap-4 font-bold'>
                <Link to='/'>
                <li>Home</li>
                </Link>
                <Link to='/'>
                <li>About</li>
                </Link>
                <Link to='/'>
                <li>Contact</li>
                </Link>
                <Link to='/'>
                <li>Sign In</li>
                </Link>
            </ul>
        </div>
    </div>
  )
}

export default Header