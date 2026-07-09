import React, { useEffect, useRef, useState } from 'react'
import { Webcam, Mic, MicOff, VideoOff } from 'lucide-react'

function CameraPreview() {
  const videoRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied or unavailable");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full w-full rounded-2xl border bg-card/10 backdrop-blur-md border-border/30 dark:border-white/10 p-2 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(91,63,217,0.1)] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_2rem_-0.5rem_rgba(91,63,217,0.5)] flex flex-col">
        {/* Inner Screen Area */}
        <div className="flex-1 rounded-xl bg-black/80 relative overflow-hidden flex flex-col items-center justify-center border border-white/5">
            
            <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${hasCamera ? 'opacity-100' : 'opacity-0'}`} 
            />

            {!hasCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                    {error ? (
                        <VideoOff strokeWidth={1.2} className="w-16 h-16 text-red-500 mb-4 opacity-70" />
                    ) : (
                        <Webcam strokeWidth={1.2} className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    )}
                    <h3 className="text-lg text-white font-medium">
                        {error ? "Camera Unavailable" : "Requesting Camera..."}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2 text-center px-8">
                        {error || "Your webcam feed will appear here during the interview so you can maintain eye contact and body language."}
                    </p>
                </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-20">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${hasCamera ? 'bg-emerald-400 animate-pulse' : 'bg-[#16A6F8] animate-pulse'}`}></div>
                    <span className="text-xs tracking-widest font-mono text-white/80">{hasCamera ? "RECORDING" : "STANDBY"}</span>
                </div>
                {hasCamera ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5 text-white/50" />}
            </div>
        </div>
    </div>
  )
}

export default CameraPreview
