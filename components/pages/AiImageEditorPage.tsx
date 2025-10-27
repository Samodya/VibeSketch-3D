
import React, { useState } from 'react';
import Button from '../common/Button';
import { editImageWithPrompt } from '../../services/geminiService';
import { ICONS } from '../../constants';
import Icon from '../common/Icon';

interface AiImageEditorPageProps {
  onNavigateToTuning: (imageUrl: string) => void;
}

const AiImageEditorPage: React.FC<AiImageEditorPageProps> = ({ onNavigateToTuning }) => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('Make the colors more vibrant and add a glowing effect.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setOriginalImage(event.target?.result as string);
                setEditedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!originalImage) {
            setError('Please upload an image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await editImageWithPrompt(originalImage, prompt);
            setEditedImage(result);
        } catch (err) {
            setError('Failed to edit image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <h1 className="text-3xl font-bold mb-4 text-cyan-400">AI Image Editor</h1>
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex-grow p-4 bg-slate-900/50 rounded-xl border border-white/10 flex items-center justify-center">
                        {originalImage ? (
                            <img src={originalImage} alt="Original" className="max-h-full max-w-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-center text-slate-400">
                                <label htmlFor="upload-editor" className="cursor-pointer p-8 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center hover:border-cyan-400 hover:text-white transition-colors">
                                  <Icon className="w-12 h-12 mb-2">{ICONS.UPLOAD}</Icon>
                                  <span>Upload an Image to Edit</span>
                                </label>
                                <input id="upload-editor" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </div>
                        )}
                    </div>
                    {originalImage && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="prompt-editor" className="font-semibold">Editing Prompt:</label>
                            <textarea
                                id="prompt-editor"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                rows={3}
                                placeholder="e.g., Change the background to a space nebula"
                            />
                            <Button onClick={handleGenerate} disabled={isLoading}>
                                {isLoading ? 'Editing...' : 'Regenerate'}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="relative flex-grow p-4 bg-slate-900/50 rounded-xl border border-white/10 flex items-center justify-center">
                      {isLoading && <div className="text-white">Generating new version...</div>}
                      {error && <p className="text-red-400 text-center">{error}</p>}
                      {editedImage && (
                          <>
                              <img src={editedImage} alt="Edited" className="max-h-full max-w-full object-contain rounded-lg" />
                              <a
                                  href={editedImage}
                                  download="vibe-sketch-edited.png"
                                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500/80 transition-all duration-300 transform hover:scale-110"
                                  title="Download Image"
                              >
                                  <Icon className="w-6 h-6">{ICONS.DOWNLOAD}</Icon>
                              </a>
                          </>
                      )}
                      {!isLoading && !editedImage && <p className="text-slate-400">Edited image will appear here</p>}
                  </div>
                  {editedImage && (
                    <Button variant="secondary" onClick={() => onNavigateToTuning(editedImage)} className="w-full flex items-center justify-center gap-2">
                      <Icon className="w-5 h-5">{ICONS.ADJUST}</Icon>
                      Adjust
                    </Button>
                  )}
                </div>
            </div>
        </div>
    );
};

export default AiImageEditorPage;