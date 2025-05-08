
import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../components/context';
import BG from '../../assets/ahmet-kaya.webp';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { visualizerData, isPlaying } = useAudio();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    let animationFrameId: number;
  
    const render = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 100;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Rasm aylanishi faqat isPlaying bo‘lsa
      if (imageRef.current && imageLoaded) {
        const image = imageRef.current;
        const size = radius * 2;
  
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotationRef.current);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(image, -radius, -radius, size, size);
        ctx.restore();
  
        if (isPlaying) {
          rotationRef.current += 0.01;
        }
      }
  
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      
      const barCount = visualizerData && visualizerData.length > 0 ? visualizerData.length : 64;
      const angleStep = (2 * Math.PI) / barCount;
      const innerOffset = 5;
      const barHeight = 2;
  
      for (let i = 0; i < barCount; i++) {
        const angle = i * angleStep;
        const magnitude = visualizerData && visualizerData.length > 0 ? visualizerData[i] / 255 : 0;
        const barLength = barHeight + magnitude * 40;
  
        const x1 = centerX + (radius + innerOffset) * Math.cos(angle);
        const y1 = centerY + (radius + innerOffset) * Math.sin(angle);
        const x2 = centerX + (radius + innerOffset + barLength) * Math.cos(angle);
        const y2 = centerY + (radius + innerOffset + barLength) * Math.sin(angle);
  
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${(i / barCount) * 360}, 100%, 60%)`;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [visualizerData, imageLoaded, isPlaying]);

  // Rasmni faqat bir marta yuklash
  useEffect(() => {
    const image = new Image();
    image.src = BG;
    image.onload = () => {
      imageRef.current = image;
      setImageLoaded(true);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={300} height={300} />
    </div>
  );
};

export default AudioVisualizer;
