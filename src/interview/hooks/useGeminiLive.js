import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for managing a real-time WebSocket connection to the
 * Gemini Multimodal Live API (BidiGenerateContent).
 * 
 * Audio from Gemini arrives as base64-encoded 24kHz PCM16-LE chunks.
 * User audio is captured via AudioWorklet at 16kHz and streamed up.
 */

// Convert Float32Array (from AudioWorklet) to Int16Array for sending
const floatTo16BitPCM = (input) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
};

// Convert Int16Array to base64 string
const int16ToBase64 = (int16Array) => {
    const uint8View = new Uint8Array(int16Array.buffer);
    let binary = '';
    for (let i = 0; i < uint8View.byteLength; i++) {
        binary += String.fromCharCode(uint8View[i]);
    }
    return window.btoa(binary);
};

export const useGeminiLive = (apiKey, resumeData) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [setupDone, setSetupDone] = useState(false);

    const wsRef = useRef(null);
    const audioContextRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const workletNodeRef = useRef(null);
    const currentAiResponseRef = useRef("");

    // Callback ref for notifying the avatar component
    const onAudioChunkRef = useRef(null);
    const onTurnStartRef = useRef(null);
    const onTurnEndRef = useRef(null);

    const setCallbacks = useCallback(({ onAudioChunk, onTurnStart, onTurnEnd }) => {
        onAudioChunkRef.current = onAudioChunk;
        onTurnStartRef.current = onTurnStart;
        onTurnEndRef.current = onTurnEnd;
    }, []);

    const connect = useCallback(async () => {
        if (wsRef.current) return;

        const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("[GeminiLive] WebSocket opened");

            const systemPrompt = `You are an expert technical and behavioral interviewer named Julia. You are conducting a live mock interview for a candidate based on this resume data:\n${JSON.stringify(resumeData)}\n\nRULES:\n1. Ask exactly 5 questions, one at a time.\n2. Wait for the candidate to finish speaking before asking the next question.\n3. Questions must be tailored to the candidate's experience, skills, and background.\n4. Keep questions concise, professional, and challenging but fair.\n5. Do NOT provide feedback on answers during the interview.\n6. Start by briefly introducing yourself and asking the first question.`;

            const setupMsg = {
                setup: {
                    model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    generationConfig: {
                        responseModalities: ["AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Aoede"
                                }
                            }
                        }
                    },
                    outputAudioTranscription: {},
                    inputAudioTranscription: {}
                }
            };
            ws.send(JSON.stringify(setupMsg));
        };

        ws.onmessage = async (event) => {
            let data;
            try {
                if (event.data instanceof Blob) {
                    const text = await event.data.text();
                    data = JSON.parse(text);
                } else {
                    data = JSON.parse(event.data);
                }
            } catch(e) {
                console.error("[GeminiLive] Failed to parse message:", e);
                return;
            }

            // Setup complete confirmation
            if (data.setupComplete) {
                console.log("[GeminiLive] Setup complete, sending initial prompt");
                setSetupDone(true);
                setIsConnected(true);

                // Send the initial user turn to trigger the AI's first question
                ws.send(JSON.stringify({
                    clientContent: {
                        turns: [{ role: "user", parts: [{ text: "Hello! I am ready to begin the interview. Please introduce yourself and ask the first question." }] }],
                        turnComplete: true
                    }
                }));

                // Start capturing microphone
                startMicCapture(ws);
                return;
            }

            // Process model response
            if (data.serverContent?.modelTurn?.parts) {
                const parts = data.serverContent.modelTurn.parts;
                for (const part of parts) {
                    if (part.text) {
                        currentAiResponseRef.current += part.text;
                    }
                    if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                        if (!isSpeaking) {
                            setIsSpeaking(true);
                            onTurnStartRef.current?.();
                        }
                        // Decode base64 PCM → Int16Array and send to avatar
                        const binaryString = window.atob(part.inlineData.data);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        // Convert to Int16Array (the raw PCM is 16-bit LE)
                        const int16Data = new Int16Array(bytes.buffer);
                        onAudioChunkRef.current?.(int16Data);
                    }
                }
            }
            
            // Handle explicit outputTranscription chunks if text doesn't come in parts
            if (data.serverContent?.outputTranscription?.text) {
                currentAiResponseRef.current += data.serverContent.outputTranscription.text;
            }

            if (data.serverContent?.turnComplete) {
                setIsSpeaking(false);
                onTurnEndRef.current?.();
                if (currentAiResponseRef.current) {
                    setTranscript(prev => [...prev, { role: "ai", content: currentAiResponseRef.current }]);
                    currentAiResponseRef.current = "";
                }
            }
        };

        ws.onerror = (err) => {
            console.error("[GeminiLive] WebSocket error:", err);
        };

        ws.onclose = (event) => {
            console.log("[GeminiLive] WebSocket closed:", event.code, event.reason);
            setIsConnected(false);
            setSetupDone(false);
            wsRef.current = null;
        };
    }, [apiKey, resumeData]);

    const startMicCapture = async (ws) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } });
            mediaStreamRef.current = stream;

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioCtx;
            
            await audioCtx.audioWorklet.addModule('/audio-processor.js');

            const source = audioCtx.createMediaStreamSource(stream);
            const workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');
            workletNodeRef.current = workletNode;

            source.connect(workletNode);
            // Don't connect to destination (prevents echo)

            workletNode.port.onmessage = (e) => {
                if (ws.readyState !== WebSocket.OPEN) return;
                const pcm16 = floatTo16BitPCM(e.data);
                const base64Audio = int16ToBase64(pcm16);

                ws.send(JSON.stringify({
                    realtimeInput: {
                        mediaChunks: [{
                            mimeType: "audio/pcm;rate=16000",
                            data: base64Audio
                        }]
                    }
                }));
            };

            // Use local browser SpeechRecognition to capture the user's side of the transcript
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = false;
                recognition.onresult = (event) => {
                    const speechText = event.results[event.results.length - 1][0].transcript;
                    setTranscript(prev => [...prev, { role: "human", content: speechText }]);
                };
                
                // Auto-restart recognition if it times out
                recognition.onend = () => {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        try { recognition.start(); } catch(e) {}
                    }
                };
                
                try { recognition.start(); } catch(e) {}
                
                // Stop recognition when WebSocket closes
                ws.addEventListener('close', () => {
                    recognition.onend = null;
                    try { recognition.stop(); } catch(e) {}
                });
            }

        } catch (err) {
            console.error("[GeminiLive] Microphone access error:", err);
        }
    };

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (workletNodeRef.current) {
            workletNodeRef.current.disconnect();
            workletNodeRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setIsConnected(false);
        setSetupDone(false);
    }, []);

    const sendText = useCallback((text) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            setTranscript(prev => [...prev, { role: "human", content: text }]);
            wsRef.current.send(JSON.stringify({
                clientContent: {
                    turns: [{ role: "user", parts: [{ text }] }],
                    turnComplete: true
                }
            }));
        }
    }, []);

    return {
        connect,
        disconnect,
        setCallbacks,
        isConnected,
        isSpeaking,
        transcript,
        sendText
    };
};
