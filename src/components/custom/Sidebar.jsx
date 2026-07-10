import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Video, Settings, LogOut, Menu, X, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react'
import { UserButton, useClerk, useUser } from '@clerk/clerk-react'
import { ModeToggle } from '../mode-toggle'
import { toast } from 'sonner'
import { Button } from '../ui/button'

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop only
    const location = useLocation();
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleSettingsClick = () => {
        toast.info("Settings page coming soon!");
        setIsOpen(false);
    };

    const handleLogout = () => {
        signOut();
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" /> },
        { name: 'Interviews', path: '/interviews', icon: <Video className="w-5 h-5 flex-shrink-0" /> },
    ];

    const SidebarContent = () => (
        <div className={`flex flex-col h-full glass-medium !rounded-none md:!rounded-r-3xl border-r border-white/10 transition-all duration-300 relative ${isCollapsed ? 'w-20 p-2' : 'w-64 p-4'}`}>
            
            {/* Desktop Collapse Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-8 glass-heavy rounded-full p-1 z-50 text-muted-foreground hover:text-foreground hover:scale-110 transition-transform"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Logo */}
            <div className={`mb-10 flex items-center justify-between ${isCollapsed ? 'px-0 justify-center mt-2' : 'px-2'}`}>
                <Link to="/" onClick={() => setIsOpen(false)} className={isCollapsed ? 'hidden' : 'block'}>
                    <img src='/logo_light.png' width={80} height={80} alt='logo' className="block dark:hidden" />
                    <img src='/logo_dark.png' width={80} height={80} alt='logo' className="hidden dark:block" />
                </Link>
                {/* Condensed Logo for Collapsed State */}
                {isCollapsed && (
                    <Link to="/" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2837D2] to-[#16A6F8] flex items-center justify-center shadow-inner">
                            <span className="text-white font-bold text-lg">AI</span>
                        </div>
                    </Link>
                )}
                {/* Mobile close button */}
                <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 flex flex-col gap-2">
                {navLinks.map((link) => {
                    const isActive = location.pathname.startsWith(link.path);
                    return (
                        <Link 
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            title={isCollapsed ? link.name : ''}
                            className={`flex items-center rounded-full transition-all font-medium text-sm ${isActive ? 'bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'} ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}`}
                        >
                            {link.icon}
                            {!isCollapsed && <span>{link.name}</span>}
                        </Link>
                    )
                })}
                <button 
                    onClick={handleSettingsClick}
                    title={isCollapsed ? "Settings" : ""}
                    className={`flex items-center rounded-full transition-all font-medium text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 text-left'}`}
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Settings</span>}
                </button>
            </div>

            {/* Bottom Actions */}
            <div className={`mt-auto flex flex-col gap-4 border-t border-border/40 pt-4 ${isCollapsed ? 'items-center' : ''}`}>
                
                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between px-2'}`}>
                    <div className="flex items-center gap-3">
                        <UserButton afterSignOutUrl="/" />
                        {!isCollapsed && <span className="text-sm font-medium truncate max-w-[100px]">{user?.firstName || 'Profile'}</span>}
                    </div>
                    <ModeToggle />
                </div>

                <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    title={isCollapsed ? "Logout" : ""}
                    className={`text-red-500 hover:text-red-600 hover:bg-red-500/10 ${isCollapsed ? 'w-10 h-10 p-0 justify-center rounded-lg' : 'w-full justify-start'}`}
                >
                    <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header (Hamburger) */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 glass-heavy !rounded-none border-b border-white/10 z-40 flex items-center px-4">
                <button onClick={() => setIsOpen(true)} className="p-2 text-foreground">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="ml-4">
                    <img src='/logo_light.png' width={60} height={60} alt='logo' className="block dark:hidden" />
                    <img src='/logo_dark.png' width={60} height={60} alt='logo' className="hidden dark:block" />
                </div>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
            )}

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:flex`}>
                <SidebarContent />
            </div>
        </>
    )
}

export default Sidebar
