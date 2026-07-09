import { 
  BrainCircuit, Wand2, Send, UserRound, MessageSquareQuote, 
  Sparkles, Shield, Zap, CheckCircle2, Star, ChevronRight, ArrowRight
} from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="w-full relative overflow-x-hidden">
      
      {/* ─── HERO ─── */}
      <section className="relative z-50 pt-24 pb-16 px-4 mx-auto max-w-screen-xl lg:pt-36 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          <div className="text-left lg:w-1/2 space-y-8 relative z-20">
            <a
              href="#"
              className="inline-flex items-center gap-3 py-1.5 px-1.5 pr-5 
                         text-sm card-glass rounded-full 
                         hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className="text-xs bg-gradient-to-r from-[#2837D2] to-[#16A6F8] rounded-full text-white px-4 py-1.5 font-bold tracking-wider uppercase">
                New
              </span>
              <span className="text-sm font-medium text-foreground">
                AI Mock Interviews Now Live
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>

            <h1 className="text-5xl font-extrabold tracking-tight leading-[1.1] text-foreground md:text-6xl lg:text-7xl">
              Build Your Resume <br/>
              <span className="relative inline-block">
                <span className="text-white relative z-10">With AI</span>
                <span className="absolute left-[-2%] top-[50%] w-[104%] h-[55%] bg-gradient-to-r from-[#2837D2] to-[#16A6F8] -z-0 rounded-sm"></span>
              </span>
            </h1>

            <p className="text-lg font-normal text-muted-foreground lg:text-xl max-w-lg leading-relaxed">
              The only resume builder designed to affect how recruiters see you. Generate, customize, and format your resume in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/dashboard"
                className="group inline-flex justify-center items-center py-4 px-8 
                           text-sm font-bold tracking-wider uppercase
                           bg-white text-black rounded-full
                           hover:scale-110 transition-all duration-300
                           shadow-[0_0_40px_rgba(99,69,255,0.15)]"
              >
                Try It Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Floating Resume Graphic */}
          <div className="lg:w-1/2 relative flex justify-center perspective-[2000px]">
            <div className="relative animate-float w-full max-w-[380px]">
              <div className="absolute inset-0 bg-[#5B3FD9]/25 blur-[100px] rounded-full"></div>
              
              <div className="noise-panel !overflow-visible p-6 shadow-2xl relative z-10 glow-purple transform rotate-y-[-10deg] rotate-x-[10deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out cursor-pointer bg-[#0D0C11]/80">
                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2837D2] to-[#16A6F8] flex items-center justify-center shadow-inner">
                    <UserRound className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-white/30 rounded-full mb-2"></div>
                    <div className="h-2 w-24 bg-white/15 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/15 rounded-full"></div>
                  <div className="h-2 w-5/6 bg-white/15 rounded-full"></div>
                  <div className="h-2 w-4/5 bg-white/15 rounded-full"></div>
                  <div className="pt-2"></div>
                  <div className="h-2 w-3/4 bg-[#5B3FD9]/30 rounded-full"></div>
                  <div className="h-2 w-full bg-white/15 rounded-full"></div>
                  <div className="h-2 w-2/3 bg-white/15 rounded-full"></div>
                </div>
                <div className="absolute -right-6 -bottom-6 noise-panel px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce bg-[#0D0C11]/80 glow-blue">
                  <Sparkles className="w-4 h-4 text-[#16A6F8]" />
                  <span className="text-sm font-bold text-white tracking-wide">AI Optimized</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-4 mx-auto max-w-screen-xl text-center relative z-10">
        <h2 className="font-extrabold text-3xl md:text-4xl text-foreground tracking-tight">
          How It Works
        </h2>
        <h3 className="text-sm text-muted-foreground mt-3 tracking-widest uppercase">
          Create a Job-Winning Resume in 3 Simple Steps
        </h3>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <BrainCircuit strokeWidth={1.5} className="h-8 w-8 text-primary" />, title: 'Describe Experience', desc: 'Provide details about your work history. Our AI generates a tailored first draft based on your background.' },
            { icon: <Wand2 strokeWidth={1.5} className="h-8 w-8 text-primary" />, title: 'Customize & Edit', desc: 'Preview layouts. Update any section until you\'re satisfied with the style, tone, and presentation.' },
            { icon: <Send strokeWidth={1.5} className="h-8 w-8 text-primary" />, title: 'Download & Share', desc: 'Export your polished resume in an ATS-friendly format, ready to share with your dream employers.' },
            { icon: (
                <div className="flex gap-1 items-end">
                  <UserRound strokeWidth={1.5} className="h-8 w-8 text-primary" />
                  <MessageSquareQuote strokeWidth={1.5} className="h-5 w-5 text-primary/70 mb-3" />
                  <UserRound strokeWidth={1.5} className="h-8 w-8 text-primary" />
                </div>
              ), title: 'AI Mock Interview', desc: 'Practice your interviewing skills with our AI, using your resume as conversational context.' }
          ].map((step, i) => (
            <div key={i} className="noise-panel bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50 p-8 group transition-all duration-300 hover:-translate-y-2 hover:glow-purple">
              <div className="icon-glass inline-flex mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                {step.icon}
              </div>
              <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── KEY FEATURES ─── */}
      <section className="py-28 relative z-10 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
              Why Choose Our AI Builder?
            </h2>
          </div>

          <div className="space-y-28">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="icon-glass inline-flex">
                  <Shield strokeWidth={1.5} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">100% ATS-Friendly Layouts</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our templates are engineered to pass through Applicant Tracking Systems. No more guessing if your resume will be read by human eyes.
                </p>
              </div>
              <div className="lg:w-1/2 noise-panel p-8 relative overflow-hidden group bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 flex-shrink-0" /><span className="text-foreground font-medium">Standardized Headings</span></div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 flex-shrink-0" /><span className="text-foreground font-medium">Clear Chronological Order</span></div>
                  <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-400 flex-shrink-0" /><span className="text-foreground font-medium">No Hidden Tables or Text Boxes</span></div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="icon-glass inline-flex">
                  <Zap strokeWidth={1.5} className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Smart Bullet Point Generation</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Stuck staring at a blank page? Give our AI your job title, and it will instantly generate powerful, action-oriented bullet points.
                </p>
              </div>
              <div className="lg:w-1/2 noise-panel p-8 relative overflow-hidden bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50">
                <div className="p-5 bg-black/30 rounded-xl border border-white/10 font-mono text-sm leading-relaxed">
                  <span className="text-muted-foreground">Prompt:</span> <span className="text-[#16A6F8]">"Software Engineer at Google"</span><br/><br/>
                  <span className="text-emerald-400">Result:</span><br/>
                  <span className="text-foreground/80">
                  • Spearheaded migration of legacy monolithic architecture to scalable microservices...<br/>
                  • Improved application load times by 45% through aggressive caching strategies...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS MARQUEE ─── */}
      <section className="py-28 relative z-10 overflow-hidden border-y border-white/5">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Loved by Job Seekers Everywhere</h2>
        </div>
        
        <div className="relative w-full flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-6 px-4">
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, idx) => (
              <div key={idx} className="noise-panel bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50 p-6 w-80 flex-shrink-0 whitespace-normal hover:scale-105 transition-transform cursor-pointer hover:glow-purple">
                <div className="flex text-amber-400 mb-3">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-sm text-foreground/85 mb-4 leading-relaxed">
                  "{['This AI builder saved me hours of formatting. I landed 3 interviews the very next week!', 
                     'The mock interview feature is a game changer. I felt so much more prepared.', 
                     'Stunning templates and incredibly easy to use. Worth every second.',
                     'Finally a resume builder that actually creates ATS friendly exports without destroying the layout.',
                     'The generated bullet points were exactly what I was trying to say but couldn\'t articulate.'][item-1]}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2837D2] to-[#16A6F8] flex items-center justify-center font-bold text-xs text-white">
                    {['AS', 'MJ', 'KT', 'DB', 'LW'][item-1]}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {['Alex S.', 'Mark J.', 'Karen T.', 'David B.', 'Lisa W.'][item-1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-28 px-4 mx-auto max-w-screen-xl text-center relative z-10">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-4 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-20 leading-relaxed">
          Everything you need to land your dream job. No hidden fees.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="noise-panel bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50 p-10 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-foreground mb-2">Basic</h3>
            <div className="text-4xl font-extrabold text-foreground mb-8">$0<span className="text-lg font-normal text-muted-foreground">/forever</span></div>
            <ul className="space-y-4 mb-10 text-left w-full text-muted-foreground">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> 1 AI Generated Resume</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" /> Basic Templates</li>
              <li className="flex items-center gap-3 opacity-40"><CheckCircle2 className="w-5 h-5 flex-shrink-0" /> No Mock Interviews</li>
            </ul>
            <Link to="/dashboard" className="w-full py-3.5 rounded-full border border-white/15 hover:bg-white/10 transition-colors font-bold tracking-wider uppercase text-sm text-center">Get Started</Link>
          </div>

          {/* Pro */}
          <div className="noise-panel bg-[#0D0C11]/30 dark:bg-[#0D0C11]/50 p-10 flex flex-col items-center relative scale-105 glow-purple hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 transform -translate-y-1/2 bg-gradient-to-r from-[#2837D2] to-[#16A6F8] text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
            <div className="text-4xl font-extrabold mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2837D2] to-[#16A6F8]">Free</span>
              <span className="text-lg font-normal text-muted-foreground">/beta</span>
            </div>
            <ul className="space-y-4 mb-10 text-left w-full text-foreground">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> Unlimited AI Resumes</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> Premium Templates</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> Unlimited AI Mock Interviews</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> AI Bullet Point Rewrite</li>
            </ul>
            <Link to="/dashboard" className="w-full py-3.5 rounded-full bg-white text-black hover:scale-105 transition-all font-bold tracking-wider uppercase text-sm text-center shadow-lg">Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 border-t border-white/5 text-center relative z-20">
        <div className="flex flex-col items-center justify-center space-y-5">
          <div className="icon-glass p-3 inline-flex">
            <BrainCircuit strokeWidth={1.5} className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground tracking-wider uppercase">
            Built by <strong className="text-foreground">KSHITIJ PATHAK</strong>
          </p>
          <p className="text-xs text-muted-foreground/40">&copy; {new Date().getFullYear()} AI Resume Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
