import React, { useState } from 'react';
import { ProductTour } from '../tour/ProductTour';
import { MultiUserDemo } from '../demo/MultiUserDemo';
import { VideoCallSimulation } from '../demo/VideoCallSimulation';
import { CRMIntegrationDemo } from '../integration/CRMIntegrationDemo';
import { MobileChatOptimization } from '../mobile/MobileChatOptimization';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send, MessageCircle, Mic, TrendingUp, Server, Database, Wifi, Zap, Building, BarChart, Lightbulb, Eye, Users, Video, Monitor, Smartphone } from 'lucide-react';

interface LandingPageProps {
  onStartConversation: (initialMessage: string) => void;
  onStartVoice: () => void;
}

export function LandingPage({ onStartConversation, onStartVoice }: LandingPageProps) {
  const [inputValue, setInputValue] = useState('');
  const [showProductTour, setShowProductTour] = useState(false);
  const [showMultiUserDemo, setShowMultiUserDemo] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showCRMDemo, setShowCRMDemo] = useState(false);
  const [showMobileDemo, setShowMobileDemo] = useState(false);
  const [mobileDevice, setMobileDevice] = useState<'mobile' | 'desktop'>('mobile');

  const quickQuestions = [
    {
      text: "I need servers for virtualization workloads",
      icon: Server,
      category: "Virtualization"
    },
    {
      text: "Looking for database servers with high performance",
      icon: Database,
      category: "Database"
    },
    {
      text: "Need edge computing solutions for remote offices",
      icon: Wifi,
      category: "Edge Computing"
    },
    {
      text: "AI/ML workloads requiring GPU acceleration",
      icon: Zap,
      category: "AI/ML"
    },
    {
      text: "Small business looking for first server",
      icon: Building,
      category: "Small Business"
    },
    {
      text: "High-performance computing for research",
      icon: TrendingUp,
      category: "HPC"
    }
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onStartConversation(inputValue.trim());
    }
  };

  const handleQuickQuestion = (question: string) => {
    onStartConversation(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleStartTour = () => {
    setShowProductTour(true);
  };

  const handleTourComplete = () => {
    setShowProductTour(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] text-white overflow-hidden relative tour-landing-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#01A982] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FF8300] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-10 w-auto"
            />
            <div className="text-sm">
              <div className="font-semibold">HPE AI Sales Assistant</div>
              <div className="text-[#01A982] text-xs">Available 24/7</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={handleStartTour}
              className="text-white hover:bg-white/10 tour-demo-button"
            >
              <Eye className="mr-2 h-4 w-4" />
              Demo Mode
            </Button>
            <Button 
              variant="ghost" 
              onClick={onStartVoice} 
              className="text-white hover:bg-white/10 tour-voice-button"
            >
              <Mic className="mr-2 h-4 w-4" />
              Voice Input
            </Button>
          </div>
        </div>

        {/* Demo Navigation Tabs */}
        <div className="px-6 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => setShowMultiUserDemo(!showMultiUserDemo)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Users className="mr-2 h-4 w-4" />
              Multi-User Demo
            </Button>
            <Button
              onClick={() => setShowVideoCall(!showVideoCall)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Video className="mr-2 h-4 w-4" />
              Video Consultation
            </Button>
            <Button
              onClick={() => setShowCRMDemo(!showCRMDemo)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Database className="mr-2 h-4 w-4" />
              CRM Integration
            </Button>
            <Button
              onClick={() => setShowMobileDemo(!showMobileDemo)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile Experience
            </Button>
          </div>
        </div>

        {/* Demo Sections */}
        {showMultiUserDemo && (
          <div className="px-6 mb-8">
            <MultiUserDemo />
          </div>
        )}

        {showCRMDemo && (
          <div className="px-6 mb-8">
            <CRMIntegrationDemo />
          </div>
        )}

        {showMobileDemo && (
          <div className="px-6 mb-8">
            <MobileChatOptimization 
              onDeviceChange={setMobileDevice}
              currentDevice={mobileDevice}
            />
          </div>
        )}

        {!showMultiUserDemo && !showCRMDemo && !showMobileDemo && (
          <>
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                {/* Hero Section */}
                <div className="space-y-6 animate-fade-in">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#01A982] to-[#FF8300] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-[#01A982] rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">HPE Sales AI Online</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Find Your Perfect
                    <span className="text-[#01A982]"> Server Solution</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Get personalized HPE ProLiant server recommendations and instant quotes in under 2 minutes. 
                    Our AI advisor understands your workload requirements.
                  </p>
                  
                  <div className="bg-gradient-to-r from-[#01A982]/20 to-[#FF8300]/20 rounded-full px-6 py-3 inline-block border border-[#01A982]/30">
                    <span className="text-[#01A982] font-bold text-lg">⚡ Get Your Server Quote in Under 2 Minutes</span>
                  </div>
                </div>

                {/* Chat Input Section */}
                <div className="space-y-8">
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl tour-chat-input">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 relative">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="What server requirements do you have?"
                          className="w-full h-14 text-lg bg-white/90 border-none text-gray-800 placeholder-gray-500 rounded-2xl pl-6 pr-16 shadow-lg focus:ring-2 focus:ring-[#01A982] focus:bg-white"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          className="absolute right-2 top-2 h-10 w-10 p-0 bg-[#01A982] hover:bg-[#018f73] rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#01A982] rounded-full animate-pulse"></div>
                        <span>AI Sales Assistant Online</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Instant responses</span>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Expert recommendations</span>
                    </div>
                  </div>

                  {/* Quick Questions */}
                  <div className="space-y-6 tour-demo-tags">
                    <h3 className="text-2xl font-semibold text-center">Or try these popular questions:</h3>
                    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          onClick={() => handleQuickQuestion(question.text)}
                          variant="ghost"
                          className="group h-auto p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#01A982]/50 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl w-full"
                        >
                          <div className="flex items-start space-x-4 w-full">
                            <div className="p-3 bg-[#01A982]/20 rounded-xl group-hover:bg-[#01A982]/30 transition-colors flex-shrink-0">
                              <question.icon className="h-6 w-6 text-[#01A982]" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-xs text-[#FF8300] font-medium mb-2 uppercase tracking-wide">
                                {question.category}
                              </div>
                              <div className="text-white font-medium leading-relaxed">
                                {question.text}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-[#01A982]/20 rounded-xl flex items-center justify-center mx-auto">
                      <BarChart className="h-6 w-6 text-[#01A982]" />
                    </div>
                    <h4 className="font-semibold">AI-Powered Recommendations</h4>
                    <p className="text-sm text-gray-400">Smart server matching based on your workload requirements</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-[#FF8300]/20 rounded-xl flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 text-[#FF8300]" />
                    </div>
                    <h4 className="font-semibold">Instant Quotes</h4>
                    <p className="text-sm text-gray-400">Professional HPE quotations generated in under 2 minutes</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                      <Lightbulb className="h-6 w-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold">Expert Support</h4>
                    <p className="text-sm text-gray-400">24/7 access to HPE sales engineers and technical specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Tour */}
      <ProductTour
        isActive={showProductTour}
        onToggle={() => setShowProductTour(!showProductTour)}
        onComplete={handleTourComplete}
      />

      {/* Video Call Simulation */}
      <VideoCallSimulation
        isActive={showVideoCall}
        onEnd={() => setShowVideoCall(false)}
        customerName="Alex Kim"
        customerCompany="InnovateTech Startup"
      />
    </div>
  );
}

              <Mic className="mr-2 h-4 w-4" />
              Voice Input
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Hero Section */}
            <div className="space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-r from-[#01A982] to-[#FF8300] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-[#01A982] rounded-full animate-pulse"></div>
                <span className="text-white font-medium">HPE Sales AI Online</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Find Your Perfect
                <span className="text-[#01A982]"> Server Solution</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Get personalized HPE ProLiant server recommendations and instant quotes in under 2 minutes. 
                Our AI advisor understands your workload requirements.
              </p>
              
              <div className="bg-gradient-to-r from-[#01A982]/20 to-[#FF8300]/20 rounded-full px-6 py-3 inline-block border border-[#01A982]/30">
                <span className="text-[#01A982] font-bold text-lg">⚡ Get Your Server Quote in Under 2 Minutes</span>
              </div>
            </div>

            {/* Chat Input Section */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="What server requirements do you have?"
                      className="w-full h-14 text-lg bg-white/90 border-none text-gray-800 placeholder-gray-500 rounded-2xl pl-6 pr-16 shadow-lg focus:ring-2 focus:ring-[#01A982] focus:bg-white"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="absolute right-2 top-2 h-10 w-10 p-0 bg-[#01A982] hover:bg-[#018f73] rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#01A982] rounded-full animate-pulse"></div>
                    <span>AI Sales Assistant Online</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Instant responses</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Expert recommendations</span>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-center">Or try these popular questions:</h3>
                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {quickQuestions.map((question, index) => (
                    )
                    )
                    }
                    <Button
                      key={index}
                      key={index}
                      onClick={() => handleQuickQuestion(question.text)}
                      variant="ghost"
                     className="group h-auto p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#01A982]/50 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl w-full"
                    >
                   <div className="flex items-start space-x-4 w-full">
                     <div className="p-3 bg-[#01A982]/20 rounded-xl group-hover:bg-[#01A982]/30 transition-colors flex-shrink-0">
                          <question.icon className="h-6 w-6 text-[#01A982]" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-[#FF8300] font-medium mb-2 uppercase tracking-wide">
                            {question.category}
                   className="group h-auto p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#01A982]/50 rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-xl w-full"
                          <div className="text-white font-medium leading-relaxed">
                           {question.text}
                   <div className="flex items-start space-x-4 w-full">
                     <div className="p-3 bg-[#01A982]/20 rounded-xl group-hover:bg-[#01A982]/30 transition-colors flex-shrink-0">
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#01A982]/20 rounded-xl flex items-center justify-center mx-auto">
                  <BarChart className="h-6 w-6 text-[#01A982]" />
                </div>
                <h4 className="font-semibold">AI-Powered Recommendations</h4>
                <p className="text-sm text-gray-400">Smart server matching based on your workload requirements</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#FF8300]/20 rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-[#FF8300]" />
                </div>
                <h4 className="font-semibold">Instant Quotes</h4>
                <p className="text-sm text-gray-400">Professional HPE quotations generated in under 2 minutes</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
                  <Lightbulb className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="font-semibold">Expert Support</h4>
                <p className="text-sm text-gray-400">24/7 access to HPE sales engineers and technical specialists</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}