import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { ChatLayout } from './components/chat/ChatLayout';
import { VoiceAgent } from './components/voice/VoiceAgent';

type AppView = 'landing' | 'chat';

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

  if (currentView === 'chat') {
    return (
      <ChatLayout
        initialMessage={initialMessage}
        onBackToLanding={handleBackToLanding}
        isVoiceActive={isVoiceActive}
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