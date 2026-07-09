import { useEffect, useRef } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/custom/Header'
import Sidebar from './components/custom/Sidebar'
import { Toaster } from './components/ui/sonner'
import { useUser } from '@clerk/clerk-react'

function App() {
  const bgRef = useRef(null);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bgRef.current) return;
      const { clientX, clientY } = e;
      bgRef.current.style.background = `radial-gradient(circle 900px at ${clientX}px ${clientY}px, rgba(91, 63, 217, 0.08), rgba(22, 166, 248, 0.04) 40%, transparent 70%)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className={`min-h-screen relative overflow-x-hidden font-sans selection:bg-primary/30 flex ${isSignedIn ? 'flex-col md:flex-row' : 'flex-col'}`}>
      <div 
        ref={bgRef}
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      ></div>

      {isSignedIn && <Sidebar />}

      <div className={`relative z-10 flex flex-col flex-grow min-h-screen w-full ${isSignedIn ? 'md:pt-0 pt-16' : ''}`}>
        {!isSignedIn && <Header/>}
        <main className="flex-grow">
          <Outlet/>
        </main>
        <Toaster/>
      </div>
    </div>
  )
}

export default App
