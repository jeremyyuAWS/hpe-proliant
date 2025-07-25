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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        addAgentMessage("Hello! I'm your HPE AI Sales Advisor, available 24/7 to help you find the perfect ProLiant server solution. I can analyze your requirements and provide personalized recommendations with instant quotations. What type of workload or project are you looking to support?");
      }, 500);
    }
  }, [isOpen]);

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
    if (!currentInput.trim()) return;

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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessageComponent 
              key={message.id} 
              message={message}
              onEscalation={phase !== CHAT_PHASES.COMPLETED ? handleEscalation : undefined}
            />
          ))}
          
          {phase === CHAT_PHASES.LEAD_CAPTURE && (
            <LeadCaptureForm onSubmit={handleLeadCapture} />
          )}
          
          {phase === CHAT_PHASES.RECOMMENDATION && recommendations.length > 0 && (
            <ServerRecommendation 
              products={recommendations}
              onApprove={handleProductApproval}
            />
          )}
          
          {phase === CHAT_PHASES.QUOTATION && (
            <QuoteGeneration />
          )}

          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">AI Advisor is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {phase !== CHAT_PHASES.LEAD_CAPTURE && phase !== CHAT_PHASES.COMPLETED && (
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}