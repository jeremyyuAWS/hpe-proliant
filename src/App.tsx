import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/landing/HeroSection';
import { ProductShowcase } from './components/landing/ProductShowcase';
import { ChatWidget } from './components/chat/ChatWidget';
import { VoiceAgent } from './components/voice/VoiceAgent';
import { AEDashboard } from './components/dashboard/AEDashboard';
import { SalesSupport } from './components/support/SalesSupport';
import { ServerProduct, ChatMessage } from './types';

type AppView = 'landing' | 'dashboard' | 'support';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  const handleStartVoice = () => {
    setIsVoiceActive(true);
  };

  const handleLearnMore = (product: ServerProduct) => {
    console.log('Learning more about:', product);
    setIsChatOpen(true);
  };

  const mockChatHistory: ChatMessage[] = [
    {
      id: '1',
      content: 'Hi, I need help with server selection for my virtualization environment.',
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: '2', 
      content: 'I can help you with that! What type of workloads are you planning to run?',
      sender: 'agent',
      timestamp: new Date(),
      type: 'text'
    }
  ];

  const mockCustomerInfo = {
    name: 'John Smith',
    company: 'TechCorp Inc',
    email: 'john@techcorp.com'
  };

  if (currentView === 'dashboard') {
    return <AEDashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {currentView === 'landing' && (
        <>
          <HeroSection 
            onStartChat={handleStartChat}
            onStartVoice={handleStartVoice}
          />
          <ProductShowcase onLearnMore={handleLearnMore} />
          
          {/* Demo Navigation */}
          <section className="py-12 bg-[#0F2027] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                  alt="HPE Logo" 
                  className="h-12 w-auto mr-4"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">HPE AI Sales Assistant Demo</h2>
                  <p className="text-[#01A982] font-medium">Experience the Future of AI-Driven Sales</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
                This comprehensive demo showcases how HPE's AI-powered sales assistant transforms the customer journey 
                from initial engagement to quote generation, demonstrating reduced time-to-quote and improved conversion rates.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-[#01A982] hover:bg-[#018f73] px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
                >
                  🎯 Account Executive Dashboard
                </button>
                <button
                  onClick={() => setShowSupport(true)}
                  className="bg-[#FF8300] hover:bg-[#e67600] px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
                >
                  🎧 Sales Support Escalation
                </button>
                <button
                  onClick={handleStartChat}
                  className="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-lg font-medium transition-colors shadow-lg"
                >
                  💬 AI Chat Experience
                </button>
              </div>
              
              <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#01A982] mb-3">⚡ Time to Quote</h3>
                  <p className="text-gray-300 text-sm">
                    Experience sub-2-minute quote generation with AI-powered requirement analysis and server recommendations.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#FF8300] mb-3">🤖 AI Engagement</h3>
                  <p className="text-gray-300 text-sm">
                    Chat and voice agents provide instant responses with seamless escalation to human sales support.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">📊 Sales Analytics</h3>
                  <p className="text-gray-300 text-sm">
                    Real-time lead tracking and automatic AE assignment with comprehensive conversation history.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onVoiceToggle={() => setIsVoiceActive(!isVoiceActive)}
        isVoiceActive={isVoiceActive}
      />

      <VoiceAgent
        isActive={isVoiceActive}
        onToggle={() => setIsVoiceActive(!isVoiceActive)}
      />

      {showSupport && (
        <SalesSupport
          chatHistory={mockChatHistory}
          customerInfo={mockCustomerInfo}
          onClose={() => setShowSupport(false)}
        />
      )}
    </div>
  );
}

export default App;