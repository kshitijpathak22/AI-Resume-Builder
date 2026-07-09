import React from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, TrendingUp, AlertTriangle, FileText, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function InterviewFeedback({ feedback, resumeId }) {
    const navigate = useNavigate();

    if (!feedback) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-border/50 bg-card/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5B3FD9]/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-4">Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2837D2] to-[#16A6F8]">Complete</span></h2>
            <p className="text-muted-foreground text-lg">Here is your AI-generated performance evaluation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score Card */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1 rounded-2xl border border-border/50 bg-card/40 p-6 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-[#16A6F8] flex items-center justify-center shadow-[0_0_30px_rgba(22,166,248,0.3)] mb-4">
                    <span className="text-5xl font-bold text-[#16A6F8]">{feedback.score}</span>
                </div>
                <h3 className="text-xl font-medium text-foreground">Overall Score</h3>
                <p className="text-sm text-muted-foreground mt-2 text-center">Based on communication, relevance, and technical depth.</p>
            </div>

            {/* Strengths & Improvements */}
            <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Strengths
                    </h3>
                    <ul className="space-y-3">
                        {feedback.strengths?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/40 p-6">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-400" /> Weaknesses
                    </h3>
                    <ul className="space-y-3">
                        {feedback.weaknesses?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Resume Suggestions */}
        <div className="rounded-2xl border border-border/50 bg-card/40 p-6 mb-8">
            <h3 className="text-lg font-medium text-foreground flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" /> Better Answers
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Based on your interview answers and resume, here is how you could have answered better:</p>
            <ul className="grid grid-cols-1 gap-4">
                {feedback.betterAnswers?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-background/50 rounded-xl p-4 border border-border/30">
                        <ArrowRight className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => window.location.reload()} className="h-12 px-8 rounded-xl">Try Again</Button>
            <Button onClick={() => navigate(`/dashboard/resume/${resumeId}/edit`)} className="h-12 px-8 rounded-xl bg-[#5B3FD9] hover:bg-[#5B3FD9]/90 text-white shadow-[0_0_15px_rgba(91,63,217,0.3)]">
                Update Resume Now
            </Button>
        </div>
    </div>
  )
}

export default InterviewFeedback
