import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ModeToggle } from '../mode-toggle'

function Header() {
    return (
        <div className='sticky top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-screen-xl'>
            <div className='glass-heavy rounded-full px-5 py-2 flex justify-between items-center'>
                <Link to="/">
                    <img src='/logo_light.png' width={72} height={72} alt='logo' className="block dark:hidden" />
                    <img src='/logo_dark.png' width={72} height={72} alt='logo' className="hidden dark:block" />
                </Link>

                <div className='flex gap-2 items-center'>
                    <ModeToggle />
                    <Link to={'/auth/sign-in'}>
                        <Button>Get started</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header