import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, Activity, Volume2 } from 'lucide-react';
import { Button } from './ui/Components';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface VoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
  systemInstruction: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ isOpen, onClose, systemInstruction }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Playback Refs
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Session Ref
  const sessionRef = useRef<any>(null);

  // Helper: Base64 to ArrayBuffer
  const decodeAudioData = async (
    base64String: string,
    ctx: AudioContext
  ): Promise<AudioBuffer> => {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Decode raw PCM
    const dataInt16 = new Int16Array(bytes.buffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = dataInt16.length;
    
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    
    return buffer;
  };

  // Helper: Float32Array to Base64 (PCM 16)
  const floatTo16BitPCM = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    let binary = '';
    const bytes = new Uint8Array(int16Array.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close(); // Not explicitly typed in mock, but assumed from disconnect logic
      sessionRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);
  };

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });

      // Init Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      nextStartTimeRef.current = 0;

      // Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
            onopen: async () => {
                console.log("Gemini Live Connected");
                setIsConnecting(false);
                setIsActive(true);

                // Start Mic Stream
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (!inputAudioContextRef.current) return;

                sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                processorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                
                processorRef.current.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    
                    // Simple volume meter
                    let sum = 0;
                    for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                    setVolume(Math.sqrt(sum / inputData.length) * 5); // Scale up visual

                    const base64PCM = floatTo16BitPCM(inputData);
                    
                    sessionPromise.then(session => {
                         session.sendRealtimeInput({
                            media: {
                                mimeType: 'audio/pcm;rate=16000',
                                data: base64PCM
                            }
                        });
                    });
                };

                sourceRef.current.connect(processorRef.current);
                processorRef.current.connect(inputAudioContextRef.current.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
                const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                if (audioData && outputAudioContextRef.current) {
                     const ctx = outputAudioContextRef.current;
                     const audioBuffer = await decodeAudioData(audioData, ctx);
                     
                     const source = ctx.createBufferSource();
                     source.buffer = audioBuffer;
                     source.connect(ctx.destination);
                     
                     const now = ctx.currentTime;
                     // Ensure we don't schedule in the past
                     nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
                     
                     source.start(nextStartTimeRef.current);
                     nextStartTimeRef.current += audioBuffer.duration;
                     
                     sourcesRef.current.add(source);
                     source.onended = () => sourcesRef.current.delete(source);
                }

                if (message.serverContent?.interrupted) {
                    sourcesRef.current.forEach(s => s.stop());
                    sourcesRef.current.clear();
                    nextStartTimeRef.current = 0;
                }
            },
            onclose: () => {
                console.log("Gemini Live Closed");
                stopSession();
            },
            onerror: (e) => {
                console.error("Gemini Live Error", e);
                setError("Erro na conexão com IA.");
                stopSession();
            }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: systemInstruction,
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not start audio session");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col items-center p-8 relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
        >
            <X size={24} />
        </button>

        <div className="mb-6 flex flex-col items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Teste de Voz ao Vivo</h2>
            <p className="text-gray-500 text-sm text-center">Converse com seu agente para testar a personalidade.</p>
        </div>

        <div className="relative mb-8">
            {/* Visualizer Circle */}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-100 ${
                isActive ? 'bg-gray-900' : 'bg-gray-100'
            }`}
            style={{
                transform: isActive ? `scale(${1 + Math.min(volume, 0.5)})` : 'scale(1)'
            }}
            >
                {isActive ? (
                    <Activity className="text-white w-12 h-12" />
                ) : (
                    <MicOff className="text-gray-400 w-12 h-12" />
                )}
            </div>
            {/* Pulse Effect */}
            {isActive && (
                 <div className="absolute inset-0 rounded-full border-4 border-gray-900 opacity-20 animate-ping"></div>
            )}
        </div>

        {error && (
            <div className="mb-4 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                {error}
            </div>
        )}

        <div className="flex gap-4">
            {!isActive ? (
                <Button 
                    onClick={startSession} 
                    isLoading={isConnecting}
                    className="w-40"
                    size="lg"
                >
                    <Mic className="mr-2 w-5 h-5" />
                    Iniciar
                </Button>
            ) : (
                <Button 
                    onClick={stopSession} 
                    variant="danger"
                    className="w-40"
                    size="lg"
                >
                    <MicOff className="mr-2 w-5 h-5" />
                    Parar
                </Button>
            )}
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <Volume2 size={12} />
            <span>Powered by Gemini Live API</span>
        </div>

      </div>
    </div>
  );
};

export default VoiceAgent;