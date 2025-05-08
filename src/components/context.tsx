import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types/track';

interface AudioContextType {
  audioContext?: AudioContext | null;
  currentTrack?: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  tracks?: Track[];
  repeat: boolean;
  volume: number;
  reverb: boolean;
  equalizer?: boolean;
  visualizerData: Uint8Array | null;
  setVolume: (value: number) => void;
  togglePlay: () => void;
  setTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleRepeat: () => void;
  toggleBassBoost: () => void;
  toggleReverb: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolumeState] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [bassBoost, setBassBoost] = useState(false);
  const [reverb, setReverb] = useState(false);
  const timeUpdateInterval = useRef<number | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const bassFilterNode = useRef<BiquadFilterNode | null>(null);
  const sourceNode = useRef<MediaElementAudioSourceNode | null>(null);
  const analyzerNode = useRef<AnalyserNode | null>(null);
  const convolverNode = useRef<ConvolverNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const visualizerDataRef = useRef<Uint8Array | null>(null);

  const initializeAudioContext = () => {
    if (!audioContext) {
      const newAudioContext = new window.AudioContext();
      setAudioContext(newAudioContext);
      if (!audioElement.current) {
        audioElement.current = new Audio();
        audioElement.current.crossOrigin = 'anonymous';
      }
      sourceNode.current = newAudioContext.createMediaElementSource(audioElement.current);
      gainNode.current = newAudioContext.createGain();
      bassFilterNode.current = newAudioContext.createBiquadFilter();
      convolverNode.current = newAudioContext.createConvolver();
      analyzerNode.current = newAudioContext.createAnalyser();
      bassFilterNode.current.type = 'lowshelf';
      bassFilterNode.current.frequency.value = 200;
      bassFilterNode.current.gain.value = 0;
      analyzerNode.current.fftSize = 128;
      const bufferLength = analyzerNode.current.frequencyBinCount;
      visualizerDataRef.current = new Uint8Array(bufferLength);
      sourceNode.current.connect(gainNode.current);
      gainNode.current.connect(bassFilterNode.current);
      bassFilterNode.current.connect(analyzerNode.current);
      analyzerNode.current.connect(newAudioContext.destination);
      if (gainNode.current) {
        gainNode.current.gain.value = volume;
      }
      createReverbImpulse(newAudioContext);
      startVisualization();
    }
  };

  const startVisualization = () => {
    const updateVisualization = () => {
      if (!analyzerNode.current || !visualizerDataRef.current) return;
      const dataArray = new Uint8Array(analyzerNode.current.frequencyBinCount);
      analyzerNode.current.getByteFrequencyData(dataArray);
      visualizerDataRef.current = dataArray;
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  const createReverbImpulse = (ctx: AudioContext) => {
    if (!convolverNode.current) return;
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * 3;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const leftChannel = impulse.getChannelData(0);
    const rightChannel = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      leftChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2);
      rightChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2);
    }
    convolverNode.current.buffer = impulse;
  };

  const seekTo = (time: number) => {
    if (audioElement.current && Math.abs(audioElement.current.currentTime - time) > 0.1) {
      audioElement.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (value: number) => {
    setVolumeState(value);
    if (gainNode.current) {
      gainNode.current.gain.value = value;
    }
  };

  const toggleBassBoost = () => {
    if (!bassFilterNode.current) return;
    const newState = !bassBoost;
    setBassBoost(newState);
    bassFilterNode.current.gain.value = newState ? 10 : 0;
  };

  const playTrack = async (track: Track) => {
    if (!audioElement.current) return;
    try {
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
      setCurrentTrack(track);
      audioElement.current.src = track.url;
      audioElement.current.load();
      await new Promise<void>((resolve) => {
        audioElement.current!.oncanplay = () => resolve();
      });
      await audioElement.current.play();
      setIsPlaying(true);
      setDuration(audioElement.current.duration || 0);
    } catch (error) {
      console.error('Error playing track:', error);
      setIsPlaying(false);
    }
  };

  const toggleReverb = () => {
    if (!sourceNode.current || !convolverNode.current || !analyzerNode.current) return;
    const newState = !reverb;
    setReverb(newState);
    if (newState) {
      sourceNode.current.disconnect();
      gainNode.current?.disconnect();
      bassFilterNode.current?.disconnect();
      sourceNode.current.connect(gainNode.current!);
      gainNode.current?.connect(bassFilterNode.current!);
      bassFilterNode.current?.connect(convolverNode.current);
      convolverNode.current.connect(analyzerNode.current);
      analyzerNode.current.connect(audioContext!.destination);
    } else {
      sourceNode.current.disconnect();
      gainNode.current?.disconnect();
      bassFilterNode.current?.disconnect();
      convolverNode.current?.disconnect();
      sourceNode.current.connect(gainNode.current!);
      gainNode.current?.connect(bassFilterNode.current!);
      bassFilterNode.current?.connect(analyzerNode.current!);
      analyzerNode.current?.connect(audioContext!.destination);
    }
  };

  const togglePlay = async () => {
    initializeAudioContext();
    if (!audioElement.current) return;
    if (isPlaying) {
      audioElement.current.pause();
      setIsPlaying(false);
    } else {
      try {
        if (currentTrack) {
          await audioElement.current.play();
          setIsPlaying(true);
        } else if (tracks.length > 0) {
          await playTrack(tracks[0]);
        }
      } catch (error) {
        console.error('Error toggling play:', error);
      }
    }
  };

  const nextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
    if (audioElement.current) {
      audioElement.current.loop = !repeat;
    }
  };

  useEffect(() => {
    const handleTrackEnded = () => {
      if (repeat) {
        if (audioElement.current) {
          audioElement.current.currentTime = 0;
          audioElement.current.play();
        }
      } else {
        nextTrack();
      }
    };
    if (audioElement.current) {
      audioElement.current.addEventListener('ended', handleTrackEnded);
    }
    return () => {
      if (audioElement.current) {
        audioElement.current.removeEventListener('ended', handleTrackEnded);
      }
    };
  }, [currentTrack, tracks, repeat]);

  useEffect(() => {
    if (!audioElement.current) return;
    const updateTime = () => {
      if (audioElement.current) {
        setCurrentTime(audioElement.current.currentTime);
      }
    };
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
    timeUpdateInterval.current = window.setInterval(updateTime, 100);
    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
      }
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  const value = {
    audioContext,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    reverb,
    volume,
    repeat,
    bassBoost,
    visualizerData: visualizerDataRef.current,
    setVolume,
    togglePlay,
    nextTrack,
    prevTrack,
    setTracks,
    toggleRepeat,
    seekTo,
    toggleBassBoost,
    toggleReverb,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};