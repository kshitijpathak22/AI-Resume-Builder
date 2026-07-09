import { useState, useRef, useCallback } from 'react';

export const useScreenRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const startRecording = useCallback(async () => {
        try {
            // Request screen video and microphone audio
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" }
            });
            
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            
            const tracks = [
                ...screenStream.getVideoTracks(),
                ...micStream.getAudioTracks()
            ];
            
            const combinedStream = new MediaStream(tracks);
            
            const mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            recordedChunksRef.current = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `interview-recording-${new Date().toISOString()}.webm`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                // Cleanup tracks
                tracks.forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            setIsRecording(true);
            
            // Handle if user clicks "Stop sharing" from browser UI
            screenStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };
            
        } catch (error) {
            console.error("Error starting screen recording:", error);
            setIsRecording(false);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording
    };
};
