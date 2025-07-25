import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { QuoteDisplay } from '../chat/QuoteDisplay';
import { Play, Pause, SkipForward, RotateCcw, User, Bot } from 'lucide-react';
import demoConversations from '../../data/demoConversations.json';
import serverProducts from '../../data/serverProducts.json';

interface DemoConversation {
  id: string;
  title: string;
  persona: {
    name: string;
    company: string;
    email: string;
    role: string;
  };
  scenario: string;
  conversation: Array<{
    timestamp: number;
    sender: 'user' | 'agent';
    content: string;
    type: string;
    products?: string[];
  }>;
}

export function AutoplayDemo() {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<any[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const conversations = demoConversations as DemoConversation[];
  const currentConversation = conversations[currentDemo];

  useEffect(() => {
    if (isPlaying && currentMessage < currentConversation.conversation.length) {
      const message = currentConversation.conversation[currentMessage];
      const nextMessage = currentConversation.conversation[currentMessage + 1];
      
      // Add current message to display
      setDisplayedMessages(prev => [...prev, message]);
      
      // Set timeout for next message
      const delay = nextMessage ? nextMessage.timestamp - message.timestamp : 3000;
      timeoutRef.current = setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
      }, delay);
    } else if (currentMessage >= currentConversation.conversation.length) {
      // Demo finished, move to next demo after delay
      timeoutRef.current = setTimeout(() => {
        generateQuoteForDemo();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentMessage, currentDemo]);

  const playDemo = () => {
    setIsPlaying(true);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentMessage(0);
    setDisplayedMessages([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const nextDemo = () => {
    setCurrentDemo(prev => (prev + 1) % conversations.length);
    resetDemo();
  };

  const generateQuoteForDemo = () => {
    const conversation = currentConversation;
    const persona = conversation.persona;
    
    // Generate quote data based on demo type
    let recommendedProduct;
    let basePrice;
    let description;
    
    switch (conversation.id) {
      case 'virtualization-demo':
        recommendedProduct = serverProducts.find(p => p.id === 'proliant-dl380-gen11');
        basePrice = 12500;
        description = 'Optimized for VMware vSphere with high memory capacity';
        break;
      case 'database-demo':
        recommendedProduct = serverProducts.find(p => p.id === 'proliant-dl580-gen11');
        basePrice = 18500;
        description = 'Mission-critical performance for database analytics';
        break;
      case 'small-business-demo':
        recommendedProduct = serverProducts.find(p => p.id === 'proliant-ml350-gen11');
        basePrice = 3200;
        description = 'Perfect for office environments with quiet operation';
        break;
      case 'ai-ml-demo':
        recommendedProduct = serverProducts.find(p => p.id === 'proliant-dl580-gen11');
        basePrice = 45000;
        description = 'GPU-accelerated configuration for AI/ML workloads';
        break;
      case 'escalation-demo':
        recommendedProduct = serverProducts.find(p => p.id === 'proliant-dl580-gen11');
        basePrice = 35000;
        description = 'HPC-optimized for computational biology research';
        break;
      default:
        recommendedProduct = serverProducts[0];
        basePrice = 8400;
        description = 'Standard enterprise server configuration';
    }

    const quantity = conversation.id === 'virtualization-demo' ? 4 : 
                   conversation.id === 'database-demo' ? 2 : 1;
    const totalPrice = basePrice * quantity;
    const discount = Math.round(totalPrice * 0.1);
    const tax = Math.round((totalPrice - discount) * 0.08);
    const finalTotal = totalPrice - discount + tax;

    const quoteData = {
      id: `HPE-${Date.now().toString().slice(-6)}`,
      customerInfo: {
        name: persona.name,
        company: persona.company,
        email: persona.email
      },
      products: [
        {
          model: recommendedProduct?.model || 'HPE ProLiant Server',
          quantity: quantity,
          unitPrice: basePrice,
          totalPrice: totalPrice,
          configuration: {
            processor: recommendedProduct?.specifications.processors || '2x Intel Xeon Scalable processors',
            memory: conversation.id === 'virtualization-demo' ? '512GB DDR5-4800 ECC' :
                   conversation.id === 'database-demo' ? '1TB DDR5-4800 ECC' :
                   conversation.id === 'ai-ml-demo' ? '2TB DDR5-4800 ECC + 4x NVIDIA H100' :
                   conversation.id === 'escalation-demo' ? '1.5TB DDR5-4800 ECC + 8x NVIDIA A100' :
                   recommendedProduct?.specifications.memory || '64GB DDR5 ECC',
            storage: conversation.id === 'database-demo' ? '8x 3.84TB NVMe SSD' :
                    conversation.id === 'ai-ml-demo' ? '16x 1.92TB NVMe SSD' :
                    recommendedProduct?.specifications.storage || '4x 960GB SSD',
            network: conversation.id === 'ai-ml-demo' ? '2x 100GbE + InfiniBand HDR' :
                    conversation.id === 'escalation-demo' ? '4x 25GbE + InfiniBand HDR200' :
                    '4x 1GbE + 2x 10GbE SFP+',
            warranty: '3-year Next Business Day with HPE Pointnext Services'
          }
        }
      ],
      pricing: {
        subtotal: totalPrice,
        discount: discount,
        tax: tax,
        total: finalTotal,
        currency: 'USD'
      },
      createdAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      assignedAE: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@hpe.com',
        phone: '+1-415-555-0123',
        territory: 'West Coast'
      },
      status: 'generated'
    };

    setGeneratedQuote(quoteData);
    setShowQuote(true);
  };

  const handleCloseQuote = () => {
    setShowQuote(false);
    setGeneratedQuote(null);
    // Auto-advance to next demo after closing quote
    setTimeout(() => {
      nextDemo();
    }, 1000);
  };

  const selectDemo = (index: number) => {
    setCurrentDemo(index);
    resetDemo();
  };

  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case 'greeting':
        return 'border-l-4 border-[#01A982] bg-green-50';
      case 'requirement':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'qualification':
        return 'border-l-4 border-purple-500 bg-purple-50';
      case 'recommendation':
        return 'border-l-4 border-[#FF8300] bg-orange-50';
      case 'approval':
        return 'border-l-4 border-green-600 bg-green-100';
      case 'quote_generation':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'completion':
        return 'border-l-4 border-emerald-600 bg-emerald-50';
      case 'escalation':
        return 'border-l-4 border-red-500 bg-red-50';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((currentMessage / currentConversation.conversation.length) * 100, 100);
  };

  // Show quote screen if generated
  if (showQuote && generatedQuote) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-8 w-auto"
              />
              <div>
                <h2 className="text-xl font-semibold">🎉 Demo Complete - Quote Generated!</h2>
                <p className="text-[#01A982] text-sm">AI-Powered Sales Process Completed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleCloseQuote}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close & Next Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-[#01A982] font-semibold">⚡ Total Time</div>
              <div className="text-white">Under 2 minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-[#FF8300] font-semibold">🤖 AI Efficiency</div>
              <div className="text-white">100% automated</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-white font-semibold">💼 Quote Value</div>
              <div className="text-white">${generatedQuote.pricing.total.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <QuoteDisplay 
            quoteData={generatedQuote}
            onClose={handleCloseQuote}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h2 className="text-xl font-semibold">HPE AI Sales Assistant Demo</h2>
              <p className="text-[#01A982] text-sm">Live Conversation Simulation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={isPlaying ? pauseDemo : playDemo}
              size="sm"
              className="bg-[#01A982] hover:bg-[#018f73]"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={resetDemo} variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={resetDemo} size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={nextDemo} size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Demo Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {conversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => selectDemo(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentDemo === index 
                  ? 'bg-[#01A982] text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div 
            className="bg-[#01A982] h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Current Demo Info */}
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-[#01A982] mb-2">Customer Profile</h3>
            <div className="space-y-1 text-gray-300">
              <p><strong>{currentConversation.persona.name}</strong></p>
              <p>{currentConversation.persona.role}</p>
              <p>{currentConversation.persona.company}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[#FF8300] mb-2">Scenario</h3>
            <p className="text-gray-300 text-sm">{currentConversation.scenario}</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-96 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-4">
          {displayedMessages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-500 ml-3' : 'bg-[#01A982] mr-3'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${getMessageTypeStyle(message.type)} animate-fade-in`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {message.sender === 'user' ? currentConversation.persona.name : 'HPE AI Advisor'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      message.type === 'greeting' ? 'bg-green-100 text-green-700' :
                      message.type === 'requirement' ? 'bg-blue-100 text-blue-700' :
                      message.type === 'qualification' ? 'bg-purple-100 text-purple-700' :
                      message.type === 'recommendation' ? 'bg-orange-100 text-orange-700' :
                      message.type === 'approval' ? 'bg-green-100 text-green-700' :
                      message.type === 'quote_generation' ? 'bg-yellow-100 text-yellow-700' :
                      message.type === 'completion' ? 'bg-emerald-100 text-emerald-700' :
                      message.type === 'escalation' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {message.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{message.content}</p>
                  
                  {message.products && (
                    <div className="mt-3 p-3 bg-white rounded-lg border">
                      <p className="text-xs font-medium text-gray-600 mb-2">Recommended Server:</p>
                      <p className="text-sm font-semibold text-[#01A982]">HPE ProLiant Server Configuration</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isPlaying && currentMessage < currentConversation.conversation.length && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#01A982] rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentMessage >= currentConversation.conversation.length && (
            <div className="text-center py-6">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Demo Complete - Generating Quote...</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Quote will display in a few seconds...</p>
            </div>
          )}
        </div>
      </div>

      {/* Demo Stats */}
      <div className="bg-gray-100 px-6 py-4 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#01A982]">
              {Math.round(currentConversation.conversation.length * 0.5)}s
            </div>
            <div className="text-xs text-gray-600">Time to Quote</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#FF8300]">
              {currentConversation.conversation.filter(m => m.type === 'qualification').length}
            </div>
            <div className="text-xs text-gray-600">Qualifying Questions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {currentConversation.conversation.filter(m => m.type === 'recommendation').length}
            </div>
            <div className="text-xs text-gray-600">Server Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
}