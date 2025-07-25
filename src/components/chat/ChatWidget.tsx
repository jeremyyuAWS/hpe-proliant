import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';  
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatMessage, Customer, ServerProduct } from '../../types';
import { MessageCircle, X, Send, Mic, MicOff, Phone } from 'lucide-react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { LeadCaptureForm } from './LeadCaptureForm';
import { ServerRecommendation } from './ServerRecommendation';
import { QuoteGeneration } from './QuoteGeneration';
import { CHAT_PHASES } from '../../utils/constants';
import demoConversations from '../../data/demoConversations.json';

interface ChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onVoiceToggle: () => void;
  isVoiceActive: boolean;
}

export function ChatWidget({ isOpen, onToggle, onVoiceToggle, isVoiceActive }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [phase, setPhase] = useState(CHAT_PHASES.GREETING);
  const [customer, setCustomer] = useState<Partial<Customer>>({});
  const [recommendations, setRecommendations] = useState<ServerProduct[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayTimeout, setAutoPlayTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (autoPlayTimeout) {
        clearTimeout(autoPlayTimeout);
      }
    };
  }, [autoPlayTimeout]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addAgentMessage("Hello! I'm your HPE AI Sales Advisor, available 24/7 to help you find the perfect ProLiant server solution. I can analyze your requirements and provide personalized recommendations with instant quotations. What type of workload or project are you looking to support?");
      }, 500);
    }
  }, [isOpen]);

  const startAutoPlayDemo = async (demoType: string) => {
    setIsAutoPlaying(true);
    setMessages([]);
    setPhase(CHAT_PHASES.GREETING);
    setCustomer({});
    setRecommendations([]);
    
    const demoData = demoConversations.find(demo => demo.id === demoType);
    if (!demoData) return;

    // Set customer data from demo
    setCustomer({
      name: demoData.persona.name,
      company: demoData.persona.company,
      email: demoData.persona.email
    });

    let messageIndex = 0;
    const playNextMessage = () => {
      if (messageIndex >= demoData.conversation.length) {
        setIsAutoPlaying(false);
        return;
      }

      const message = demoData.conversation[messageIndex];
      const nextMessage = demoData.conversation[messageIndex + 1];
      
      if (message.sender === 'agent') {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
          addAgentMessage(message.content, message.type as any, message.products ? { products: message.products } : undefined);
          
          // Handle phase transitions
          if (message.type === 'qualification' && message.content.includes('basic information')) {
            setPhase(CHAT_PHASES.LEAD_CAPTURE);
          } else if (message.type === 'qualification' && message.content.includes('requirements')) {
            setPhase(CHAT_PHASES.REQUIREMENTS);
          } else if (message.type === 'recommendation') {
            setPhase(CHAT_PHASES.RECOMMENDATION);
            // Load recommended products
            loadRecommendationsForDemo(demoType);
          } else if (message.type === 'quote_generation') {
            setPhase(CHAT_PHASES.QUOTATION);
          } else if (message.type === 'completion') {
            setPhase(CHAT_PHASES.COMPLETED);
          }
          
          messageIndex++;
          const delay = nextMessage ? Math.min(nextMessage.timestamp - message.timestamp, 3000) : 2000;
          setAutoPlayTimeout(setTimeout(playNextMessage, delay));
        }, 1500);
        setAutoPlayTimeout(timeout);
      } else {
        addUserMessage(message.content);
        messageIndex++;
        const delay = nextMessage ? Math.min(nextMessage.timestamp - message.timestamp, 1000) : 1000;
        setAutoPlayTimeout(setTimeout(playNextMessage, delay));
      }
    };

    setTimeout(playNextMessage, 1000);
  };

  const loadRecommendationsForDemo = async (demoType: string) => {
    const { default: serverProducts } = await import('../../data/serverProducts.json');
    
    let recommendedProducts: ServerProduct[] = [];
    
    switch (demoType) {
      case 'virtualization-demo':
        recommendedProducts = serverProducts.filter(p => p.useCases.includes('virtualization')).slice(0, 1);
        break;
      case 'database-demo':
        recommendedProducts = serverProducts.filter(p => p.useCases.includes('database')).slice(0, 1);
        break;
      case 'small-business-demo':
        recommendedProducts = serverProducts.filter(p => p.useCases.includes('small-business')).slice(0, 1);
        break;
      case 'ai-ml-demo':
        recommendedProducts = serverProducts.filter(p => p.useCases.includes('ai-ml')).slice(0, 1);
        break;
      default:
        recommendedProducts = serverProducts.slice(0, 1);
    }
    
    setRecommendations(recommendedProducts);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout);
      setAutoPlayTimeout(null);
    }
    setIsTyping(false);
  };

  const addAgentMessage = (content: string, type: 'text' | 'recommendation' | 'quote' = 'text', data?: any) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'agent',
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user', 
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isAutoPlaying) return;

    addUserMessage(currentInput);
    const userMessage = currentInput;
    setCurrentInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Handle different phases
    if (phase === CHAT_PHASES.GREETING) {
      addAgentMessage("Great! I'd love to help you find the right server solution. First, let me collect some basic information so I can provide personalized recommendations.");
      setTimeout(() => {
        setPhase(CHAT_PHASES.LEAD_CAPTURE);
      }, 1000);
    } else if (phase === CHAT_PHASES.REQUIREMENTS) {
      await handleRequirementsPhase(userMessage);
    }
  };

  const handleLeadCapture = (leadData: { name: string; company: string; email: string }) => {
    if (isAutoPlaying) return;
    
    setCustomer(prev => ({ ...prev, ...leadData }));
    addAgentMessage(`Thanks ${leadData.name}! Now, let's talk about your server requirements. What type of workloads are you planning to run?`);
    setPhase(CHAT_PHASES.REQUIREMENTS);
  };

  const handleRequirementsPhase = async (userMessage: string) => {
    // Simple keyword-based recommendation logic
    const message = userMessage.toLowerCase();
    let recommendedProducts: ServerProduct[] = [];

    // Import server products
    const { default: serverProducts } = await import('../../data/serverProducts.json');
    
    if (message.includes('virtualization') || message.includes('vmware') || message.includes('hyper-v')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('virtualization'));
    } else if (message.includes('database') || message.includes('sql') || message.includes('oracle')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('database'));
    } else if (message.includes('small') || message.includes('office') || message.includes('startup')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('small-business'));
    } else if (message.includes('ai') || message.includes('machine learning') || message.includes('analytics')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('ai-ml'));
    } else {
      // Default recommendations
      recommendedProducts = serverProducts.slice(0, 2);
    }

    setRecommendations(recommendedProducts.slice(0, 2));
    addAgentMessage(
      `Based on your requirements, I recommend these HPE ProLiant servers:`,
      'recommendation',
      { products: recommendedProducts.slice(0, 2) }
    );
    setPhase(CHAT_PHASES.RECOMMENDATION);
  };

  const handleProductApproval = (products: ServerProduct[]) => {
    if (isAutoPlaying) return;
    
    addAgentMessage("Excellent choice! Let me generate a customized quote for you right away.");
    setPhase(CHAT_PHASES.QUOTATION);
    
    setTimeout(() => {
      addAgentMessage(
        "Your quote has been generated and will be sent to your email shortly. I've also assigned you to one of our senior account executives who will follow up within 24 hours.",
        'quote',
        { products, customer }
      );
      setPhase(CHAT_PHASES.COMPLETED);
    }, 2000);
  };

  const handleEscalation = () => {
    addAgentMessage("I'm connecting you with our sales support team. Please hold on while I transfer your conversation...");
    // In a real implementation, this would trigger the escalation flow
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full h-14 w-14 bg-[#01A982] hover:bg-[#018f73] shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <Card className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-[#01A982] text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">HPE AI Sales Advisor</h3>
              <p className="text-xs opacity-80">Online now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoiceToggle}
              className={`text-white hover:bg-white/20 ${isVoiceActive ? 'bg-white/20' : ''}`}
            >
              {isVoiceActive ? <Phone className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>  
        </div>

        {/* Demo Tags */}
        {messages.length <= 1 && !isAutoPlaying && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <p className="text-xs text-gray-600 mb-3">💡 Try these demo scenarios:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => startAutoPlayDemo('virtualization-demo')}
                className="px-3 py-1.5 bg-white border border-green-200 rounded-full text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
              >
                🖥️ Virtualization
              </button>
              <button
                onClick={() => startAutoPlayDemo('database-demo')}
                className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
              >
                📊 Database
              </button>
              <button
                onClick={() => startAutoPlayDemo('small-business-demo')}
                className="px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700 hover:bg-purple-50 transition-colors"
              >
                🏢 Small Business
              </button>
              <button
                onClick={() => startAutoPlayDemo('ai-ml-demo')}
                className="px-3 py-1.5 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-700 hover:bg-orange-50 transition-colors"
              >
                🤖 AI/ML
              </button>
            </div>
          </div>
        )}

        {/* Autoplay Controls */}
        {isAutoPlaying && (
          <div className="px-4 py-2 bg-yellow-50 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-yellow-800">Demo in progress...</span>
            </div>
            <button
              onClick={stopAutoPlay}
              className="text-xs text-yellow-700 hover:text-yellow-900 font-medium"
            >
              Stop Demo
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessageComponent 
              key={message.id} 
              message={message}
              onEscalation={phase !== CHAT_PHASES.COMPLETED && !isAutoPlaying ? handleEscalation : undefined}
            />
          ))}
          
          {phase === CHAT_PHASES.LEAD_CAPTURE && !isAutoPlaying && (
            <LeadCaptureForm onSubmit={handleLeadCapture} />
          )}
          
          {phase === CHAT_PHASES.RECOMMENDATION && recommendations.length > 0 && !isAutoPlaying && (
            <ServerRecommendation 
              products={recommendations}
              onApprove={handleProductApproval}
            />
          )}
          
          {phase === CHAT_PHASES.QUOTATION && (
            <QuoteGeneration />
          )}

          {(isTyping || isAutoPlaying) && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">{isAutoPlaying ? 'Demo running...' : 'AI Advisor is typing...'}</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {phase !== CHAT_PHASES.LEAD_CAPTURE && phase !== CHAT_PHASES.COMPLETED && !isAutoPlaying && (
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={isAutoPlaying}
              />
              <Button onClick={handleSendMessage} size="sm" disabled={isAutoPlaying}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}