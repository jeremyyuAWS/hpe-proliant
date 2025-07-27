import React, { useState } from 'react';
import { Button } from './components/ui/Button';
import { LandingPage } from './components/landing/LandingPage';
import { ChatLayout } from './components/chat/ChatLayout';
import { VoiceAgent } from './components/voice/VoiceAgent';
import { AEDashboard } from './components/dashboard/AEDashboard';
import { AutoplayDemo } from './components/demo/AutoplayDemo';

type AppView = 'landing' | 'chat' | 'dashboard' | 'autoplay';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [initialMessage, setInitialMessage] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const handleStartConversation = (message: string) => {
    setInitialMessage(message);
    setCurrentView('chat');
  };

  const handleStartVoice = () => {
    setIsVoiceActive(true);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setInitialMessage('');
    setIsVoiceActive(false);
  };

  const handleViewDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleViewAutoplay = () => {
    setCurrentView('autoplay');
  };

  if (currentView === 'chat') {
    return (
      <ChatLayout
        initialMessage={initialMessage}
        onBackToLanding={handleBackToLanding}
        isVoiceActive={isVoiceActive}
      />
    );
  }

  if (currentView === 'dashboard') {
    return <AEDashboard />;
  }

  if (currentView === 'autoplay') {
    return <AutoplayDemo />;
  }

  return (
    <div>
      <LandingPage
        onStartConversation={handleStartConversation}
        onStartVoice={handleStartVoice}
      />

      <VoiceAgent
        isActive={isVoiceActive}
        onToggle={() => setIsVoiceActive(!isVoiceActive)}
      />

      {/* Demo Navigation */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        <Button
          onClick={handleViewDashboard}
          className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
          size="sm"
        >
          View Dashboard
        </Button>
        <Button
          onClick={handleViewAutoplay}
          className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
          size="sm"
        >
          Autoplay Demo
        </Button>
      </div>
    </div>
  );
}

export default App;