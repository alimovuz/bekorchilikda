import { LuPause, LuPlay, LuRepeat, LuSkipBack, LuSkipForward, LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu'
import { useAudio } from '../../components/context'
import { useEffect } from 'react'
import Popover from '../../components/popover';
import { sampleTracks } from '../../data/tracks';


const PlayerControls = () => {
  const {repeat, isPlaying, volume, currentTime, duration, setVolume, setTracks, nextTrack, togglePlay,  prevTrack, seekTo, toggleRepeat} = useAudio()
  
  useEffect(() => {
    setTracks?.(sampleTracks)
  }, [])

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Volume icon based on level
  const getVolumeIcon = () => {
    if (volume === 0) return <LuVolumeX size={20} />;
    if (volume < 0.5) return <LuVolume1 size={20} />;
    return <LuVolume2 size={20} />;
  };

  return (
    <div className="player-controls">
    {/* Progress Bar */}
    <div className="flex items-center mb-2 mx-2">
      <span className="text-xs text-gray-400 w-10">{formatTime(currentTime)}</span>
      <div className="relative flex-grow h-2 bg-gray-700 rounded-full">
        {/* Progress background */}
        <div className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>

        {/* Seek knob */}
        <input type="range" min={0} max={duration || 0} value={currentTime} step={0.1} onChange={(e) => seekTo(parseFloat(e.target.value))} className="absolute w-full h-full opacity-0 cursor-pointer" />
      </div>
      <span className="text-xs text-end text-gray-400 w-10">{formatTime(duration || 0)}</span>
    </div>

    {/* Control Buttons */}
    <div className="flex items-center justify-between mx-3">
        {/* Volume Control */}
        <Popover trigger={
            <button className="text-gray-400 hover:text-white transition-colors " onClick={() => setVolume(volume === 0 ? 0.5 : 0)} >{getVolumeIcon()}</button>
          }
          position="right">
          <div className="w-16 flex items-center">
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500" />
          </div>
        </Popover>

      {/* Play Controls */}
      <div className="flex items-center justify-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors" onClick={prevTrack} >   
        <LuSkipBack size={24} />
        </button>
        <button className="w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full transition-colors" onClick={togglePlay} >
          {isPlaying ? ( <LuPause size={24} /> ) : ( <LuPlay size={24} className="ml-1" /> )}
        </button>
        <button className="text-gray-400 hover:text-white transition-colors" onClick={nextTrack} >
          <LuSkipForward size={24} />
        </button>
      </div>

      {/* Repeat Button */}
      <div className="flex items-center gap-2">
        <button className={`text-gray-400 hover:text-white transition-colors ${ repeat ? "text-purple-500" : "" }`} onClick={toggleRepeat} title={repeat ? "Repeat on" : "Repeat off"} >
          <LuRepeat size={20} />
        </button>
      </div>
    </div>
{/* 
    <div className='flex justify-center mt-10 items-center gap-5 text-white'>
      <button onClick={toggleBassBoost} className='px-5 py-2 rounded-md bg-blue-600'>bass</button>
      <button onClick={toggleReverb} className='px-5 py-2 rounded-md bg-blue-600'>Reverb</button>
      <button className='px-5 py-2 rounded-md bg-blue-600'>Equakizer</button>
    </div> */}
  </div>
  )
}

export default PlayerControls
