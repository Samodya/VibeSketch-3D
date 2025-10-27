
import React, { useState, useCallback } from 'react';
import Button from '../common/Button';
import { editImageWithPrompt } from '../../services/geminiService';
import { ICONS } from '../../constants';
import Icon from '../common/Icon';

type EnhanceAction = 'upscale' | 'enhance' | 'restore';

interface UploadEnhancePageProps {
  onNavigateToTuning: (imageUrl: string) => void;
}

const ACTION_PROMPTS: Record<EnhanceAction, string> = {
    upscale: 'Upscale this image to a higher resolution, making it sharper and more detailed without adding new elements.',
    enhance: 'Enhance this image by improving its lighting, contrast, and color balance to make it more vivid and clear.',
    restore: 'Restore this old or damaged image. Fix scratches, improve clarity, and correct color fading.',
};

const UploadEnhancePage: React.FC<UploadEnhancePageProps> = ({ onNavigateToTuning }) => {
    const [image, setImage] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setResultImage(null);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleAction = async (action: EnhanceAction) => {
        if (!image) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImage(null);
        try {
            const prompt = ACTION_PROMPTS[action];
            const result = await editImageWithPrompt(image, prompt);
            setResultImage(result);
        } catch (err) {
            setError('Failed to process image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-4 text-cyan-400">Upload & Enhance</h1>
            <p className="text-slate-300 mb-8 max-w-2xl">Upload any image to upscale its resolution, enhance details, or restore old photos with a single click.</p>
            <div className="w-full max-w-4xl p-8 bg-slate-900/50 rounded-xl border border-white/10">
                {!image ? (
                     <div 
                         className="w-full h-64 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:text-white transition-colors"
                         onDragOver={(e) => e.preventDefault()}
                         onDrop={(e) => { e.preventDefault(); onDrop(e.dataTransfer.files); }}
                     >
                         <label htmlFor="upload-enhance" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                             <Icon className="w-12 h-12 mb-2 text-slate-400">{ICONS.UPLOAD}</Icon>
                             <p>Drag & drop an image here, or click to select</p>
                             <input id="upload-enhance" type="file" accept="image/*" className="hidden" onChange={(e) => onDrop(e.target.files!)} />
                         </label>
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col items-center justify-center">
                            <h2 className="font-bold text-lg mb-2">Original</h2>
                            <img src={image} alt="Original" className="rounded-lg max-h-80 w-auto" />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4">
                            <h2 className="font-bold text-lg mb-2">Result</h2>
                            <div className="w-full h-80 bg-black/20 rounded-lg flex items-center justify-center border border-slate-700">
                                {isLoading && <div className="text-white">Processing...</div>}
                                {resultImage && <img src={resultImage} alt="Result" className="rounded-lg max-h-full w-auto" />}
                                {!isLoading && !resultImage && <p className="text-slate-400">Result will appear here</p>}
                            </div>
                            {resultImage && (
                                <div className="flex gap-4">
                                  <Button variant="secondary" onClick={() => onNavigateToTuning(resultImage)} className="flex items-center justify-center gap-2">
                                      <Icon className="w-5 h-5">{ICONS.ADJUST}</Icon>
                                      Adjust
                                  </Button>
                                  <Button variant="primary" onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = resultImage;
                                      link.download = 'vibe-sketch-enhanced.png';
                                      link.click();
                                  }} className="flex items-center justify-center gap-2">
                                      <Icon className="w-5 h-5">{ICONS.DOWNLOAD}</Icon>
                                      Download
                                  </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {image && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => handleAction('upscale')} disabled={isLoading} variant="primary">Upscale</Button>
                        <Button onClick={() => handleAction('enhance')} disabled={isLoading} variant="secondary">Enhance Details</Button>
                        <Button onClick={() => { setImage(null); setResultImage(null); }} disabled={isLoading}>Clear Image</Button>
                    </div>
                )}
                 {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default UploadEnhancePage;