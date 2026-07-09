import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ModeToggle } from '../mode-toggle'

function Header() {
    return (
        <div className='p-3 px-5 flex justify-between items-center border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50'>
            <Link to="/">
                <img src='/logo_light.png' width={80} height={80} alt='logo' className="block dark:hidden" />
                <img src='/logo_dark.png' width={80} height={80} alt='logo' className="hidden dark:block" />
            </Link>

            <div className='flex gap-2 items-center'>
                <ModeToggle />
                <Link to={'/auth/sign-in'}>
                    <Button>Get started</Button>
                </Link>
            </div>
        </div>
    )
}

export default Header