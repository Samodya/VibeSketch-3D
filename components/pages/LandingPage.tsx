
import React from 'react';
import Button from '../common/Button';
import { ICONS } from '../../constants';
import Icon from '../common/Icon';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center backdrop-blur-md bg-black/20 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl shadow-black/50">
        <Icon className="w-20 h-20 text-cyan-400 mb-4">{ICONS.GENERATOR}</Icon>
        <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          VibeSketch 3D
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Draw. Imagine. Create.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={onGetStarted} variant="primary" className="w-full sm:w-auto">Get Started</Button>
          <Button onClick={onGetStarted} variant="secondary" className="w-full sm:w-auto">Sign In with Google</Button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <a href="#" className="hover:text-white mx-2">Terms</a> | 
        <a href="#" className="hover:text-white mx-2">Privacy</a> | 
        <a href="#" className="hover:text-white mx-2">Help</a>
      </footer>
    </div>
  );
};

export default LandingPage;
