import React, { useState } from 'react';
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
  const [autoplayDemoType, setAutoplayDemoType] = useState<string>('');

  const handleStartConversation = (message: string, isDemo?: boolean, demoType?: string) => {
    if (isDemo && demoType) {
      setAutoplayDemoType(demoType);
      setCurrentView('autoplay');
    } else {
    setInitialMessage(message);
    setCurrentView('chat');
    }
  };

  const handleStartVoice = () => {
    setIsVoiceActive(true);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setInitialMessage('');
    setIsVoiceActive(false);
    setAutoplayDemoType('');
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
    return (
      <AutoplayDemo 
        demoType={autoplayDemoType}
        onBackToLanding={handleBackToLanding}
      />
    );
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
    </div>
  );
}

export default App;