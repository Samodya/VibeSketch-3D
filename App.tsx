
import React, { useState, useCallback } from 'react';
import { Page } from './types';
import LandingPage from './components/pages/LandingPage';
import Sidebar from './components/common/Sidebar';
import SketchPage from './components/sketch/SketchPage';
import AiImageEditorPage from './components/pages/AiImageEditorPage';
import UploadEnhancePage from './components/pages/UploadEnhancePage';
import ImageGeneratorPage from './components/pages/ImageGeneratorPage';
import ImageTuningPage from './components/pages/ImageTuningPage';

const App: React.FC = () => {
  const [currentPage, _setCurrentPage] = useState<Page>(Page.Landing);
  const [previousPage, setPreviousPage] = useState<Page | null>(null);
  const [imageToTune, setImageToTune] = useState<string | null>(null);

  const setCurrentPage = (page: Page) => {
    _setCurrentPage(prevPage => {
      if (prevPage !== Page.ImageTuning) {
        setPreviousPage(prevPage);
      }
      return page;
    });
  };

  const handleGetStarted = useCallback(() => {
    setCurrentPage(Page.Sketch);
  }, []);
  
  const handleNavigateToTuning = useCallback((imageUrl: string) => {
    setImageToTune(imageUrl);
    _setCurrentPage(Page.ImageTuning);
  }, []);

  const handleBackFromTuning = useCallback(() => {
    _setCurrentPage(previousPage ?? Page.Sketch);
  }, [previousPage]);


  const renderPage = () => {
    switch (currentPage) {
      case Page.Sketch:
        return <SketchPage onNavigateToTuning={handleNavigateToTuning} />;
      case Page.Editor:
        return <AiImageEditorPage onNavigateToTuning={handleNavigateToTuning} />;
      case Page.Upscale:
        return <UploadEnhancePage onNavigateToTuning={handleNavigateToTuning} />;
      case Page.Generator:
        return <ImageGeneratorPage onNavigateToTuning={handleNavigateToTuning} />;
      case Page.ImageTuning:
        return imageToTune ? <ImageTuningPage imageSrc={imageToTune} onBack={handleBackFromTuning} /> : <SketchPage onNavigateToTuning={handleNavigateToTuning} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1E1B4B] via-slate-900 to-purple-950 text-white font-['Poppins']">
      {currentPage === Page.Landing ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="flex flex-col md:flex-row h-screen">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            {renderPage()}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;