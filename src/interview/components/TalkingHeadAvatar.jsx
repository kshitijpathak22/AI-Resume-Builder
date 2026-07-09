import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TalkingHead } from '@met4citizen/talkinghead';
import { HeadAudio } from '@met4citizen/headaudio/dist/headaudio.min.mjs';

const TalkingHeadAvatar = forwardRef(({ avatarUrl }, ref) => {
    const containerRef = useRef(null);
    const headRef = useRef(null);
    const initRef = useRef(false);
    const headAudioRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || initRef.current) return;
        initRef.current = true;

        const head = new TalkingHead(containerRef.current, {
            ttsEndpoint: null,
            ttsApikey: null,
            lipsyncModules: [],
            cameraView: "upper",
            cameraRotateEnable: false,
            cameraPanEnable: false,
            cameraZoomEnable: false,
            lightAmbientColor: 0xffffff,
            lightAmbientIntensity: 2.5,
            lightDirectColor: 0x9090bb,
            lightDirectIntensity: 25,
            avatarMood: "neutral",
            avatarIdleEyeContact: 0.6,
            avatarSpeakingEyeContact: 0.8,
            avatarSpeakingHeadMove: 0.7,
            pcmSampleRate: 24000
        });

        headRef.current = head;

        const initAvatar = async () => {
            try {
                await head.showAvatar({
                    url: avatarUrl || '/brunette.glb',
                    body: "F"
                });
                console.log("TalkingHead avatar loaded successfully");
            } catch (error) {
                console.error("Error loading talkinghead avatar:", error);
            }
        };

        initAvatar();

        return () => {
            if (headRef.current) {
                try { headRef.current.stop(); } catch(e) {}
            }
        };
    }, [avatarUrl]);

    useImperativeHandle(ref, () => ({
        // Start a streaming session for real-time audio from Gemini
        startStreaming: async () => {
            if (headRef.current) {
                try {
                    const head = headRef.current;
                    await head.streamStart({
                        sampleRate: 24000
                    });
                    console.log("TalkingHead streaming started");

                    if (!headAudioRef.current) {
                        await head.audioCtx.audioWorklet.addModule("/headworklet.min.mjs");
                        const headaudio = new HeadAudio(head.audioCtx);
                        await headaudio.loadModel("/model-en-mixed.bin");
                        head.audioStreamGainNode.connect(headaudio);

                        headaudio.onvalue = (key, value) => {
                            if (head.mtAvatar && head.mtAvatar[key]) {
                                Object.assign(head.mtAvatar[key], { newvalue: value, needsUpdate: true });
                            }
                        };
                        head.opt.update = headaudio.update.bind(headaudio);

                        let lastEnded = 0;
                        headaudio.onended = () => { lastEnded = Date.now(); };
                        headaudio.onstarted = () => {
                            if (Date.now() - lastEnded > 150) {
                                head.lookAtCamera(500);
                                head.speakWithHands();
                            }
                        };

                        headAudioRef.current = headaudio;
                    }
                } catch(e) {
                    console.error("Error starting TalkingHead streaming:", e);
                }
            }
        },
        // Feed a raw PCM audio chunk (Int16Array or ArrayBuffer) 
        feedAudioChunk: (pcmData) => {
            if (headRef.current) {
                headRef.current.streamAudio({ audio: pcmData });
            }
        },
        // Signal that the current AI turn's audio has ended
        notifyEndOfTurn: () => {
            if (headRef.current) {
                headRef.current.streamNotifyEnd();
            }
        },
        // Interrupt the avatar immediately
        interrupt: () => {
            if (headRef.current) {
                headRef.current.streamInterrupt();
            }
        },
        // Stop the streaming session entirely
        stopStreaming: () => {
            if (headRef.current) {
                try { headRef.current.streamStop(); } catch(e) {}
            }
        },
        stop: () => {
            if (headRef.current) {
                headRef.current.stop();
            }
        }
    }));

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 shadow-[0_0_20px_rgba(91,63,217,0.15)] bg-[#0a090e]">
            <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ minHeight: '400px' }}></div>
            {/* Bottom gradient overlay for blending into background */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-[#0D0C11] to-transparent"></div>
            {/* Label */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5B3FD9] animate-pulse"></div>
                <span className="text-xs font-mono tracking-widest text-white/50">AI INTERVIEWER</span>
            </div>
        </div>
    );
});

TalkingHeadAvatar.displayName = 'TalkingHeadAvatar';

export default TalkingHeadAvatar;
