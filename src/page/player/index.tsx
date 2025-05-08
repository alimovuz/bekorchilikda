import React, { useRef } from 'react';
import AudioVisualizer from './AudioVisualizer';
import PlayerControls from './playerControls';

const Playing: React.FC = () => {
  const playerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={playerRef}
      className="h-full"
    >
        <div className="h-full flex flex-col justify-between pb-5">
          {/* Album Art and Visualizer */}
          <div className="relative h-full rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <AudioVisualizer />
          </div>
          
          {/* Player Controls */}
          <div className="mt-4">
            <PlayerControls />
          </div>
      </div>
    </div>
  );
};

export default Playing;