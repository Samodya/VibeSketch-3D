import React, { useRef, useEffect, useCallback, useState } from 'react';

interface CanvasProps {
  width: number;
  height: number;
  brushColor: string;
  brushSize: number;
  onDrawEnd: (dataUrl: string) => void;
  initialDataUrl?: string;
}

const Canvas: React.FC<CanvasProps> = ({ width, height, brushColor, brushSize, onDrawEnd, initialDataUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  // Ref to track the last point for calculating speed
  const lastPointRef = useRef({ x: 0, y: 0, time: Date.now() });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    const image = new Image();
    image.onload = () => {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
    };

    if (initialDataUrl) {
      image.src = initialDataUrl;
    } else {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [initialDataUrl, width, height]);

  useEffect(() => {
    if (contextRef.current) {
        contextRef.current.strokeStyle = brushColor;
        contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent): { offsetX: number; offsetY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e.nativeEvent) {
      return {
        offsetX: e.nativeEvent.touches[0].clientX - rect.left,
        offsetY: e.nativeEvent.touches[0].clientY - rect.top,
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const ctx = contextRef.current;
    if (!ctx) return;
    const { offsetX, offsetY } = getCoords(e);
    setIsDrawing(true);
    lastPointRef.current = { x: offsetX, y: offsetY, time: Date.now() };

    // Draw a single dot to handle clicks without movement
    ctx.save();
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.shadowBlur = brushSize / 3;
    ctx.shadowColor = brushColor;
    ctx.fill();
    ctx.restore();

    e.preventDefault();
  }, [brushColor, brushSize]);

  const finishDrawing = useCallback(() => {
    if (!contextRef.current || !canvasRef.current || !isDrawing) return;
    setIsDrawing(false);
    onDrawEnd(canvasRef.current.toDataURL('image/png'));
  }, [isDrawing, onDrawEnd]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const ctx = contextRef.current;
    const { offsetX, offsetY } = getCoords(e);
    const { x: lastX, y: lastY, time: lastTime } = lastPointRef.current;

    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    
    // Throttle drawing to avoid performance issues on rapid events
    if (timeDelta < 8) return;

    const distance = Math.hypot(offsetX - lastX, offsetY - lastY);
    const speed = distance / timeDelta; // Speed in pixels per millisecond

    // --- Dynamic Visual Effects ---
    const blur = Math.min(speed * 3 + brushSize / 4, 25);
    const dynamicAlpha = Math.max(1 - speed * 0.1, 0.4);

    ctx.save();
    
    // Apply effects
    ctx.globalAlpha = dynamicAlpha;
    ctx.shadowBlur = blur;
    ctx.shadowColor = brushColor;
    
    // Set brush properties for the line segment
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;

    // Draw the line segment from the last point to the current one
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    ctx.restore();

    // Update the last point reference
    lastPointRef.current = { x: offsetX, y: offsetY, time: currentTime };
    e.preventDefault();
  }, [isDrawing, brushColor, brushSize]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onMouseLeave={finishDrawing}
      onTouchStart={startDrawing}
      onTouchEnd={finishDrawing}
      onTouchMove={draw}
      className="bg-white border border-gray-300 rounded-xl cursor-crosshair touch-none"
    />
  );
};

export default React.memo(Canvas);