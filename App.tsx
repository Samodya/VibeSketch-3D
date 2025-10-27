
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
      // Only update the previous page if we are navigating away from a page 
      // that is NOT the tuning page itself. This ensures that when we navigate
      // *to* the tuning page, we remember where we came from.
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
    // Use the main navigation function to ensure the previous page is tracked
    setCurrentPage(Page.ImageTuning);
  }, []);

  const handleBackFromTuning = useCallback(() => {
    // Navigate back to the stored previous page, defaulting to Sketch page if none is set.
    setCurrentPage(previousPage ?? Page.Sketch);
  }, [previousPage]);

  // All pages are rendered but only the active one is visible.
  // This preserves the state of each page when navigating between them.
  const pages = {
    [Page.Sketch]: <SketchPage onNavigateToTuning={handleNavigateToTuning} />,
    [Page.Editor]: <AiImageEditorPage onNavigateToTuning={handleNavigateToTuning} />,
    [Page.Upscale]: <UploadEnhancePage onNavigateToTuning={handleNavigateToTuning} />,
    [Page.Generator]: <ImageGeneratorPage onNavigateToTuning={handleNavigateToTuning} />,
    [Page.ImageTuning]: imageToTune ? <ImageTuningPage imageSrc={imageToTune} onBack={handleBackFromTuning} /> : null,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1E1B4B] via-slate-900 to-purple-950 text-white font-['Poppins']">
      {currentPage === Page.Landing ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div className="flex flex-col md:flex-row h-screen">
          <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="flex-1 overflow-auto p-4 md:p-8">
            {Object.entries(pages).map(([pageKey, pageComponent]) => (
              <div key={pageKey} style={{ display: currentPage === Number(pageKey) ? 'block' : 'none' }} className="h-full">
                {pageComponent}
              </div>
            ))}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
