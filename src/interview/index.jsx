import React, { useEffect, useState, useRef } from 'react'
import Header from '@/components/custom/Header'
import CameraPreview from './components/CameraPreview'
import InterviewFeedback from './components/InterviewFeedback'
import TalkingHeadAvatar from './components/TalkingHeadAvatar'
import GlobalApi from '~/service/GlobalApi'
import { useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, Video, VideoOff, Lightbulb } from 'lucide-react'
import { useGeminiLive } from './hooks/useGeminiLive'
import { useScreenRecorder } from './hooks/useScreenRecorder'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

function InterviewPage() {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [fetchingHint, setFetchingHint] = useState(false);

  const avatarRef = useRef(null);

  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

  const geminiLive = useGeminiLive(apiKey, resumeData);
  const screenRecorder = useScreenRecorder();

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await GlobalApi.GetResumeById(resumeId);
        setResumeData(data);
        setLoading(false);
      } catch (e) {
        console.error("Error loading resume:", e);
        setLoading(false);
      }
    };
    loadResume();
  }, [resumeId]);

  // Wire up Gemini Live audio callbacks to the TalkingHead avatar
  useEffect(() => {
    geminiLive.setCallbacks({
      onAudioChunk: (int16Data) => {
        if (avatarRef.current) {
          avatarRef.current.feedAudioChunk(int16Data);
        }
      },
      onTurnStart: () => {
        if (avatarRef.current) {
          avatarRef.current.startStreaming();
        }
      },
      onTurnEnd: () => {
        if (avatarRef.current) {
          avatarRef.current.notifyEndOfTurn();
        }
      }
    });
  }, [geminiLive.setCallbacks]);

  const handleStartInterview = async () => {
      await geminiLive.connect();
  }

  const handleEndInterview = async () => {
      geminiLive.disconnect();
      if (screenRecorder.isRecording) {
          screenRecorder.stopRecording();
      }

      setGeneratingFeedback(true);
      
      const history = geminiLive.transcript;
      
      try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/interview/feedback`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ history })
          });
          const feedbackData = await res.json();
          setFeedback(feedbackData);
          setInterviewComplete(true);
      } catch (error) {
          console.error("Feedback error:", error);
          toast.error("Failed to generate feedback");
      } finally {
          setGeneratingFeedback(false);
      }
  }

  const handleGetHint = async () => {
      const history = geminiLive.transcript;
      if (history.length === 0) {
          toast.info("The interview hasn't started yet.");
          return;
      }
      
      // Find the last AI question
      let currentQuestion = "";
      for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].role === "ai") {
              currentQuestion = history[i].content;
              break;
          }
      }

      if (!currentQuestion) {
          toast.info("Wait for the AI to ask a question first.");
          return;
      }

      // Find the user's answer to the current question (if any)
      let currentAnswer = "";
      for (let i = history.length - 1; i >= 0; i--) {
          if (history[i].role === "human") {
              currentAnswer = history[i].content;
              break;
          } else if (history[i].role === "ai") {
              // Stop when we hit the question
              break;
          }
      }

      setFetchingHint(true);
      try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api/interview/hint`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resumeData, currentQuestion, currentAnswer })
          });
          const data = await res.json();
          toast.message("Hint", {
              description: data.hint,
              duration: 10000,
          });
      } catch (error) {
          console.error("Hint error:", error);
          toast.error("Failed to generate a hint.");
      } finally {
          setFetchingHint(false);
      }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-[#5B3FD9]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {!interviewComplete ? (
          <>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Mock Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2837D2] to-[#16A6F8]">Session</span>
                </h1>
                <p className="mt-2 text-muted-foreground tracking-wider uppercase text-sm">Targeting: {resumeData?.title}</p>
              </div>
              
              <div className="flex items-center gap-4">
                 {!geminiLive.isConnected && !generatingFeedback && (
                    <Button 
                        onClick={handleStartInterview} 
                        className="bg-[#5B3FD9] hover:bg-[#5B3FD9]/90 text-white px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(91,63,217,0.4)]"
                    >
                        Start Real-time Interview
                    </Button>
                 )}
                 {geminiLive.isConnected && (
                     <Button 
                        onClick={handleEndInterview} 
                        disabled={generatingFeedback}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full text-lg shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                        {generatingFeedback ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                        End Interview
                    </Button>
                 )}
              </div>
            </div>

            {generatingFeedback ? (
                <div className="rounded-2xl border bg-card/10 backdrop-blur-md border-border/30 dark:border-white/10 p-16 shadow-[0_0_15px_rgba(91,63,217,0.1)] flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-16 h-16 animate-spin text-[#5B3FD9] mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-4">Analyzing Interview</h3>
                    <p className="text-muted-foreground text-center max-w-md">The AI is reviewing your answers to generate your final score, strengths, weaknesses, and resume improvements...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: 3D Avatar */}
                      <div className="h-[500px]">
                        <TalkingHeadAvatar ref={avatarRef} avatarUrl="/brunette.glb" />
                      </div>

                      {/* Right: Camera Feed */}
                      <div className="h-[500px] w-full rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_20px_rgba(22,166,248,0.15)] bg-[#0a090e]">
                        <CameraPreview />
                        {/* Live Session Label */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            {geminiLive.isConnected ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-xs font-mono tracking-widest text-emerald-400">LIVE</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-xs font-mono tracking-widest text-red-500">OFFLINE</span>
                                </>
                            )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Action Bar when Connected */}
                    {geminiLive.isConnected && (
                        <div className="rounded-2xl border bg-card/10 backdrop-blur-md border-border/30 dark:border-white/10 p-6 shadow-[0_0_15px_rgba(91,63,217,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
                            
                            <div className="flex-1 w-full max-w-sm">
                                <div className="flex items-center gap-4 mb-2">
                                    <span className="text-sm font-medium text-foreground">AI Status:</span>
                                    {geminiLive.isSpeaking ? (
                                        <span className="text-sm text-[#16A6F8] animate-pulse font-semibold">Speaking...</span>
                                    ) : (
                                        <span className="text-sm text-emerald-400 font-semibold">Listening...</span>
                                    )}
                                </div>
                                <div className="h-10 flex items-center gap-1">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className={`w-1.5 rounded-full ${geminiLive.isSpeaking ? 'bg-[#16A6F8]' : 'bg-[#5B3FD9]'} ${geminiLive.isConnected ? 'animate-pulse' : ''}`} style={{ height: geminiLive.isConnected ? `${Math.random() * 20 + 8}px` : '4px', animationDelay: `${i * 0.05}s`}}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 w-full sm:w-auto">
                                <Button 
                                    onClick={handleGetHint}
                                    disabled={fetchingHint}
                                    variant="outline"
                                    className="flex-1 sm:flex-none h-14 px-8 rounded-xl text-md transition-all duration-300 border-border/30 dark:border-white/10 backdrop-blur-md hover:bg-yellow-500/20 hover:text-yellow-500 hover:border-yellow-500/50"
                                >
                                    {fetchingHint ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lightbulb className="w-5 h-5 mr-2" />}
                                    Get Hint
                                </Button>
                                
                                <Button 
                                    onClick={() => {
                                        if (screenRecorder.isRecording) {
                                            screenRecorder.stopRecording();
                                        } else {
                                            screenRecorder.startRecording();
                                        }
                                    }}
                                    variant="outline"
                                    className={`flex-1 sm:flex-none h-14 px-8 rounded-xl text-md transition-all duration-300 border-border/30 dark:border-white/10 backdrop-blur-md ${screenRecorder.isRecording ? 'bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500 hover:text-white' : 'hover:bg-primary/20 hover:text-primary hover:border-primary/50'}`}
                                >
                                    {screenRecorder.isRecording ? (
                                        <><VideoOff className="w-5 h-5 mr-2" /> Stop Recording</>
                                    ) : (
                                        <><Video className="w-5 h-5 mr-2" /> Record Screen</>
                                    )}
                                </Button>
                            </div>

                        </div>
                    )}
                </div>
            )}
          </>
        ) : (
          <InterviewFeedback feedback={feedback} resumeId={resumeId} />
        )}
      </div>
    </div>
  )
}

export default InterviewPage
