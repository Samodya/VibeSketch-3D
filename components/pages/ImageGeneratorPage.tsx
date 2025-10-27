import React, { useState } from 'react';
import Button from '../common/Button';
import { generateImageFromPrompt } from '../../services/geminiService';
import Icon from '../common/Icon';
import { ICONS } from '../../constants';

const EXAMPLE_PROMPTS = [
    "A photorealistic 3D render of a crystal fox in an enchanted forest",
    "Futuristic cityscape in neon lights, glassmorphism style",
    "A tranquil zen garden on Mars, detailed landscape",
    "An elaborate mechanical heart made of gears and glowing tubes",
];

interface ImageGeneratorPageProps {
  onNavigateToTuning: (imageUrl: string) => void;
}

const ImageGeneratorPage: React.FC<ImageGeneratorPageProps> = ({ onNavigateToTuning }) => {
    const [prompt, setPrompt] = useState<string>(EXAMPLE_PROMPTS[0]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateImageFromPrompt(prompt);
            setGeneratedImages(prev => [result, ...prev]);
            setSelectedImageIndex(0); // Select the newly generated image
        } catch (err) {
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const selectedImageUrl = selectedImageIndex !== null ? generatedImages[selectedImageIndex] : null;

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-2 text-cyan-400">Image Generator</h1>
            <p className="text-slate-300 mb-4">Describe anything you can imagine, and watch our AI bring it to life in stunning detail.</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full flex-grow p-3 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    rows={2}
                    placeholder="e.g., A robot holding a red skateboard"
                />
                <Button onClick={handleGenerate} disabled={isLoading} className="h-fit">
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </Button>
            </div>
             <div className="mb-6">
                <p className="text-sm text-slate-400 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map(p => (
                        <button key={p} onClick={() => setPrompt(p)} className="text-xs bg-slate-700/50 px-3 py-1 rounded-full hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors">
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            
            <div className="flex-grow flex flex-col md:flex-row gap-8 min-h-0">
                {/* Main Preview */}
                <div className="flex-1 bg-black/20 rounded-lg flex flex-col items-center justify-center border border-dashed border-slate-600 p-4">
                  {isLoading && generatedImages.length === 0 && <p>Generating your masterpiece...</p>}
                  {!isLoading && !selectedImageUrl && <p className="text-slate-400 text-center">Your generated images will appear here.</p>}
                  {selectedImageUrl && (
                      <>
                        <img src={selectedImageUrl} alt={`Generated art ${selectedImageIndex! + 1}`} className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg" />
                        <div className="flex gap-4 mt-4">
                           <Button variant="secondary" onClick={() => onNavigateToTuning(selectedImageUrl)} className="flex items-center justify-center gap-2">
                              <Icon className="w-5 h-5">{ICONS.ADJUST}</Icon>
                              Adjust
                            </Button>
                            <a href={selectedImageUrl} download={`vibe-sketch-generated-${selectedImageIndex! + 1}.png`}>
                              <Button variant="primary" className="flex items-center justify-center gap-2">
                                <Icon className="w-5 h-5">{ICONS.DOWNLOAD}</Icon>
                                Download
                              </Button>
                            </a>
                        </div>
                      </>
                  )}
                </div>

                {/* Image History */}
                {generatedImages.length > 0 && (
                  <div className="w-full md:w-40 flex-shrink-0 flex flex-col">
                      <h3 className="text-lg font-bold text-cyan-400 mb-2">History</h3>
                      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pb-2 md:pb-0">
                          {generatedImages.map((image, index) => (
                              <button
                                  key={index}
                                  onClick={() => setSelectedImageIndex(index)}
                                  className={`aspect-square w-24 h-24 md:w-full md:h-auto flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-transparent hover:border-slate-500'}`}
                              >
                                  <img src={image} alt={`History item ${index + 1}`} className="w-full h-full object-cover" />
                              </button>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        </div>
    );
};

export default ImageGeneratorPage;