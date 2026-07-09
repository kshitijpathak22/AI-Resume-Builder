import { UserRound, MessageSquareQuote } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function InterviewSelectionCard({resume}) {
  return (
       <div className='group active:scale-[0.97] transition-transform duration-200 cursor-pointer'>
          <Link to={'/my-resume/'+resume.documentId+'/interview'}>
            <div className='p-14 card-glass h-[280px] rounded-t-xl border-t-4 transition-all hover:border-primary hover:shadow-[0_0_2rem_-0.5rem_rgba(91,63,217,0.5)] relative flex flex-col items-center justify-center'
            style={{ borderColor: resume?.themeColor || 'var(--primary)' }}>
                
                <div className='flex flex-col items-center justify-center h-[180px] w-full'>
                    <div className="icon-glass group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 flex items-end justify-center gap-2 px-6 py-4 bg-white/5 dark:bg-black/5 border-white/20">
                        {/* Small Avatars Illustration */}
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shadow-inner">
                                <UserRound strokeWidth={1.5} className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">AI</span>
                        </div>
                        
                        <MessageSquareQuote strokeWidth={1.5} className="w-5 h-5 text-[#16A6F8] opacity-70 mb-5" />
                        
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                <UserRound strokeWidth={1.5} className="w-5 h-5 text-foreground" />
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">You</span>
                        </div>
                    </div>
                    
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center inset-0 bg-background/60 backdrop-blur-sm rounded-t-xl z-10">
                        <span className="text-primary font-semibold tracking-wide bg-background/90 px-6 py-3 rounded-full border border-white/20 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center">
                            Start Interview<br/>
                            <span className="text-xs font-normal text-muted-foreground">Practice with AI</span>
                        </span>
                    </div>
                </div>

            </div>
          </Link>
          <div className='border border-t-0 p-3 flex justify-between text-white rounded-b-xl shadow-lg backdrop-blur-xl'
           style={{ background: resume?.themeColor ? `${resume.themeColor}dd` : 'rgba(91, 63, 217, 0.8)' }}>
            <h2 className='text-sm font-medium truncate'>{resume.title}</h2>
          </div>
        </div>
  )
}

export default InterviewSelectionCard
