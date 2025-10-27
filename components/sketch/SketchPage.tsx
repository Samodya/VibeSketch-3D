
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Canvas from './Canvas';
import Button from '../common/Button';
import { generateImageFromSketch } from '../../services/geminiService';
import { ICONS } from '../../constants';
import Icon from '../common/Icon';

interface SketchPageProps {
  onNavigateToTuning: (imageUrl: string) => void;
}

const SketchPage: React.FC<SketchPageProps> = ({ onNavigateToTuning }) => {
  const [activeColor, setActiveColor] = useState('#000000');
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 });

  const brushColor = isErasing ? '#FFFFFF' : activeColor;

  const handleDrawEnd = useCallback((dataUrl: string) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(dataUrl);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveColor(e.target.value);
    setIsErasing(false);
  };

  const toggleEraser = () => {
    setIsErasing(prev => !prev);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
    }
  };

  const handleClear = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };
  
  const handleGenerate = async () => {
    if (history.length === 0 || historyIndex < 0) {
      setError("Please draw something first!");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);
    try {
      const sketchDataUrl = history[historyIndex];
      const result = await generateImageFromSketch(sketchDataUrl, prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError("Failed to generate image. Please check your API key and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        const size = Math.min(width, height, 600) * 0.9; // Reduced size by 10%
        setCanvasSize({ width: size, height: size });
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-grow flex flex-col items-center justify-center" ref={containerRef}>
        <div className="w-full flex justify-center items-center p-2 bg-slate-900/50 rounded-t-xl gap-2 md:gap-4 border-b border-white/10 flex-wrap">
            <input type="color" value={activeColor} onChange={handleColorChange} className="w-10 h-10 rounded-md bg-transparent border-none cursor-pointer" title="Choose your drawing color"/>
            <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 md:w-32" title={`Adjust brush thickness: ${brushSize}px`} />
            <button onClick={toggleEraser} title={isErasing ? "Switch back to Brush" : "Switch to Eraser"} className={`p-2 rounded-md transition-colors ${isErasing ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <Icon className="w-5 h-5">{ICONS.ERASER}</Icon>
            </button>
            <button onClick={handleUndo} disabled={historyIndex <= 0} title="Undo last action" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon className="w-5 h-5">{ICONS.UNDO}</Icon>
            </button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} title="Redo last action" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon className="w-5 h-5">{ICONS.REDO}</Icon>
            </button>
            <button onClick={handleClear} title="Clear the entire canvas (cannot be undone)" className="p-2 rounded-md bg-slate-700 hover:bg-slate-600">
                <Icon className="w-5 h-5">{ICONS.CLEAR}</Icon>
            </button>
        </div>
        <Canvas
          width={canvasSize.width}
          height={canvasSize.height}
          brushColor={brushColor}
          brushSize={brushSize}
          onDrawEnd={handleDrawEnd}
          initialDataUrl={history[historyIndex]}
        />
      </div>

      <div className="w-full lg:w-96 flex-shrink-0 flex flex-col gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold text-cyan-400">AI Controls</h2>
        <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="font-semibold">Describe your vision (optional):</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              rows={3}
              placeholder="e.g., Add a futuristic neon style"
            />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate 3D Image'}
        </Button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex-grow bg-black/20 rounded-lg flex items-center justify-center border border-dashed border-slate-600">
          {isLoading && <div className="text-white">Processing...</div>}
          {generatedImage && <img src={generatedImage} alt="Generated result" className="object-contain max-h-full max-w-full rounded-lg" />}
          {!isLoading && !generatedImage && <p className="text-slate-400">Your image will appear here</p>}
        </div>
        {generatedImage && (
          <div className="flex gap-4">
             <Button variant="secondary" onClick={() => onNavigateToTuning(generatedImage)} className="flex-1 flex items-center justify-center gap-2">
                <Icon className="w-5 h-5">{ICONS.ADJUST}</Icon>
                Adjust
              </Button>
              <Button variant="primary" onClick={() => {
                  const link = document.createElement('a');
                  link.href = generatedImage;
                  link.download = 'vibe-sketch-3d-art.png';
                  link.click();
              }} className="flex-1 flex items-center justify-center gap-2">
                <Icon className="w-5 h-5">{ICONS.DOWNLOAD}</Icon>
                Download
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchPage;
