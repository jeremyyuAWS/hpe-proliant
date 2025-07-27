import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Button } from '../ui/Button';
import { Play, Pause, SkipForward, RotateCcw, Eye } from 'lucide-react';

interface ProductTourProps {
  isActive: boolean;
  onToggle: () => void;
  onComplete: () => void;
}

export function ProductTour({ isActive, onToggle, onComplete }: ProductTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourMode, setTourMode] = useState<'overview' | 'ai-chat' | 'dashboard' | 'voice'>('overview');

  const overviewSteps: Step[] = [
    {
      target: '.tour-landing-hero',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">🚀 Welcome to HPE AI Sales Assistant</h3>
          <p>This is a complete AI-powered sales experience that transforms how customers discover and purchase HPE ProLiant servers.</p>
          <div className="bg-[#01A982]/10 p-3 rounded-lg">
            <p className="text-sm"><strong>Demo Highlights:</strong> 24/7 AI advisor, instant quotes, seamless AE handoff</p>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true
    },
    {
      target: '.tour-chat-input',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">💬 AI-Powered Conversations</h3>
          <p>Our AI understands natural language and guides customers through requirement gathering to server recommendations.</p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800"><strong>Try it:</strong> Type any server question or click a demo scenario</p>
          </div>
        </div>
      ),
      placement: 'top'
    },
    {
      target: '.tour-demo-tags',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">🎮 Interactive Demo Scenarios</h3>
          <p>Watch realistic customer conversations play out automatically. Each scenario demonstrates different use cases and customer types.</p>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800"><strong>Demo Types:</strong> Enterprise, Startup, Manufacturing, Healthcare</p>
          </div>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '.tour-voice-button',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">🎙️ Voice Integration</h3>
          <p>Customers can interact using voice commands for a hands-free experience. Perfect for mobile users or accessibility needs.</p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800"><strong>Innovation:</strong> Speech-to-text with AI understanding</p>
          </div>
        </div>
      ),
      placement: 'left'
    }
  ];

  const chatSteps: Step[] = [
    {
      target: '.tour-chat-window',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">🤖 Intelligent Chat Interface</h3>
          <p>The AI maintains conversation context, asks clarifying questions, and provides personalized recommendations.</p>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800"><strong>AI Features:</strong> Natural language processing, context awareness, product expertise</p>
          </div>
        </div>
      ),
      placement: 'center'
    },
    {
      target: '.tour-quote-generation',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">📄 Instant Quote Generation</h3>
          <p>Professional HPE-branded PDFs generated automatically with pricing, specifications, and AE assignment.</p>
          <div className="bg-[#FF8300]/10 p-3 rounded-lg">
            <p className="text-sm"><strong>Business Impact:</strong> 2-minute quote vs. traditional 2-day process</p>
          </div>
        </div>
      ),
      placement: 'top'
    }
  ];

  const dashboardSteps: Step[] = [
    {
      target: '.tour-ae-dashboard',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#0F2027]">👨‍💼 Account Executive Dashboard</h3>
          <p>Real-time lead tracking, conversation history, and automated lead assignment based on territory and expertise.</p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800"><strong>Sales Efficiency:</strong> Qualified leads with full context</p>
          </div>
        </div>
      ),
      placement: 'center'
    }
  ];

  const steps = tourMode === 'overview' ? overviewSteps : 
                tourMode === 'ai-chat' ? chatSteps : dashboardSteps;

  useEffect(() => {
    if (isActive) {
      setRun(true);
    } else {
      setRun(false);
      setStepIndex(0);
    }
  }, [isActive]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, action } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
      onComplete();
    } else if (action === 'next' || action === 'prev') {
      setStepIndex(index + (action === 'next' ? 1 : -1));
    }
  };

  const handleTourModeChange = (mode: 'overview' | 'ai-chat' | 'dashboard' | 'voice') => {
    setTourMode(mode);
    setStepIndex(0);
    setRun(true);
  };

  if (!isActive) return null;

  return (
    <>
      {/* Tour Controls */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white shadow-2xl rounded-2xl p-4 border-2 border-[#01A982]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#01A982] rounded-full animate-pulse"></div>
            <span className="font-bold text-[#0F2027]">Demo Mode Active</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => handleTourModeChange('overview')}
              className={tourMode === 'overview' ? 'bg-[#01A982]' : 'bg-gray-300'}
            >
              Overview
            </Button>
            <Button
              size="sm"
              onClick={() => handleTourModeChange('ai-chat')}
              className={tourMode === 'ai-chat' ? 'bg-[#01A982]' : 'bg-gray-300'}
            >
              AI Chat
            </Button>
            <Button
              size="sm"
              onClick={() => handleTourModeChange('dashboard')}
              className={tourMode === 'dashboard' ? 'bg-[#01A982]' : 'bg-gray-300'}
            >
              Dashboard
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setRun(false)}>
              <Pause className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setRun(true)}>
              <Play className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onToggle}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Joyride Component */}
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#01A982',
            backgroundColor: '#ffffff',
            textColor: '#0F2027',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            arrowColor: '#ffffff',
            zIndex: 9998
          },
          tooltip: {
            borderRadius: '16px',
            padding: '20px',
            fontSize: '16px'
          },
          tooltipContainer: {
            textAlign: 'left'
          },
          tooltipTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '10px'
          },
          buttonNext: {
            backgroundColor: '#01A982',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600'
          },
          buttonBack: {
            backgroundColor: 'transparent',
            border: '2px solid #01A982',
            color: '#01A982',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600'
          },
          buttonSkip: {
            backgroundColor: 'transparent',
            color: '#6B7280',
            fontSize: '14px'
          }
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Complete Tour',
          next: 'Next',
          skip: 'Skip Tour'
        }}
      />

      {/* Pulsing Indicators */}
      {run && (
        <>
          <div className="tour-pulse-indicator tour-landing-hero"></div>
          <div className="tour-pulse-indicator tour-chat-input"></div>
          <div className="tour-pulse-indicator tour-demo-tags"></div>
          <div className="tour-pulse-indicator tour-voice-button"></div>
        </>
      )}

      <style jsx>{`
        .tour-pulse-indicator {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #01A982;
          animation: pulse-glow 2s infinite;
          z-index: 9997;
          pointer-events: none;
        }
        
        @keyframes pulse-glow {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(1, 169, 130, 0.7);
          }
          70% {
            transform: scale(1.1);
            opacity: 0.8;
            box-shadow: 0 0 0 20px rgba(1, 169, 130, 0);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(1, 169, 130, 0);
          }
        }
      `}</style>
    </>
  );
}