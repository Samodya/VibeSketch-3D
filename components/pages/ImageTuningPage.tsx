import React, { useState, useCallback, useRef } from 'react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import { ICONS } from '../../constants';

// Props for the main page component
interface ImageTuningPageProps {
  imageSrc: string;
  onBack: () => void;
}

// Initial state for image filters
const initialFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hue: 0,
};

// Type for the names of the filters
type FilterName = keyof typeof initialFilters;

// Props for the individual slider component
interface SliderProps {
  name: FilterName;
  label: string;
  min: string;
  max: string;
  value: number;
  unit: string;
  onValueChange: (name: FilterName, value: string) => void;
}

// --- Slider Component ---
// Moved outside of the ImageTuningPage component.
// This is a crucial fix: defining a component inside another component's render function
// causes it to be re-created on every render, which breaks React's state management
// and can make interactive elements like sliders unresponsive.
const Slider: React.FC<SliderProps> = ({ name, label, min, max, value, unit, onValueChange }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="font-semibold text-slate-300">{label}</label>
        <span className="text-sm font-mono bg-slate-800 px-2 py-1 rounded">{value}{unit}</span>
      </div>
      <input
        id={name}
        type="range"
        min={min}
        max={max}
        value={value}
        onInput={(e) => onValueChange(name, (e.target as HTMLInputElement).value)}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
);


// --- Image Tuning Page Component ---
const ImageTuningPage: React.FC<ImageTuningPageProps> = ({ imageSrc, onBack }) => {
  const [filters, setFilters] = useState(initialFilters);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFilterChange = (filterName: FilterName, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: Number(value) }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const getFilterString = useCallback(() => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) hue-rotate(${filters.hue}deg)`;
  }, [filters]);

  const downloadImage = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.onload = () => {
        canvas.width = tempImg.naturalWidth;
        canvas.height = tempImg.naturalHeight;
        ctx.filter = getFilterString();
        ctx.drawImage(tempImg, 0, 0);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'vibe-sketch-tuned.png';
        link.click();
    };
    tempImg.src = imageSrc;
  }, [getFilterString, imageSrc]);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-cyan-400">Image Tuner</h1>
        <Button onClick={onBack} variant="secondary">Back</Button>
      </div>
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-4 bg-slate-900/50 rounded-xl border border-white/10 flex items-center justify-center">
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Image to tune"
            className="max-h-full max-w-full object-contain rounded-lg transition-all duration-100"
            style={{ filter: getFilterString() }}
          />
        </div>
        <div className="lg:col-span-1 p-6 bg-slate-900/50 rounded-xl border border-white/10 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">Adjustments</h2>
          <Slider name="brightness" label="Brightness" min="0" max="200" value={filters.brightness} unit="%" onValueChange={handleFilterChange} />
          <Slider name="contrast" label="Contrast" min="0" max="200" value={filters.contrast} unit="%" onValueChange={handleFilterChange} />
          <Slider name="saturate" label="Saturation" min="0" max="200" value={filters.saturate} unit="%" onValueChange={handleFilterChange} />
          <Slider name="hue" label="Hue" min="0" max="360" value={filters.hue} unit="deg" onValueChange={handleFilterChange} />
          <div className="flex-grow"></div>
          <div className="flex flex-col gap-4">
            <Button onClick={resetFilters} variant="secondary">Reset Adjustments</Button>
            <Button onClick={downloadImage} variant="primary" className="flex items-center justify-center gap-2">
                <Icon className="w-5 h-5">{ICONS.DOWNLOAD}</Icon>
                Download Tuned Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageTuningPage;