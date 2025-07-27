import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { QuoteDisplay } from '../chat/QuoteDisplay';
import { ChatWindow } from '../chat/ChatWindow';
import { ChatHistoryPanel } from '../chat/ChatHistoryPanel';
import { ActivityPanel } from '../chat/ActivityPanel';
import { Play, Pause, SkipForward, RotateCcw, ArrowLeft, MessageSquare, Activity, TrendingUp } from 'lucide-react';
import demoConversations from '../../data/demoConversations.json';
import serverProducts from '../../data/serverProducts.json';
import { ChatMessage } from '../../types';

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

interface AutoplayDemoProps {
  demoType?: string;
  onBackToLanding?: () => void;
}

export function AutoplayDemo({ demoType, onBackToLanding }: AutoplayDemoProps) {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [chatHistories, setChatHistories] = useState<any[]>([]);
  const [activityData, setActivityData] = useState({
    isProcessing: false,
    currentAction: '',
    relatedTopics: [] as string[],
    sourceCount: 8,
    processingTime: 1200
  });
  const timeoutRef = useRef<NodeJS.Timeout>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversations = demoConversations as DemoConversation[];
  const currentConversation = conversations[currentDemo];

  // Start specific demo if demoType is provided
  useEffect(() => {
    if (demoType) {
      const demoIndex = conversations.findIndex(conv => conv.id === demoType);
      if (demoIndex !== -1) {
        setCurrentDemo(demoIndex);
        setIsPlaying(true);
      }
    }
  }, [demoType]);

  // Auto-scroll to bottom when new messages are added during autoplay
  useEffect(() => {
    if (isPlaying && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayedMessages, isPlaying]);

  // Format message content with markdown support
  const formatMessageContent = (content: string) => {
    return content
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Bullet points
      .replace(/^[•·] (.+)$/gm, '<li>$1</li>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Wrap consecutive list items
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      // Line breaks
      .split('\n').map(line => {
        if (line.includes('<ul>') || line.includes('<li>')) {
          return line;
        }
        return line;
      }).join('<br>')
      // Clean up nested ul tags
      .replace(/<\/ul><br><ul>/g, '')
      .replace(/<ul><li>/g, '<ul><li>')
      .replace(/<\/li><\/ul>/g, '</li></ul>');
  };
  useEffect(() => {
    if (isPlaying && currentMessage < currentConversation.conversation.length) {
      const message = currentConversation.conversation[currentMessage];
      const nextMessage = currentConversation.conversation[currentMessage + 1];
      
      // Set processing state for agent messages
      if (message.sender === 'agent') {
        setActivityData(prev => ({ 
          ...prev, 
          isProcessing: true, 
          currentAction: getActionForMessageType(message.type),
          relatedTopics: getTopicsForMessage(message.content)
        }));
      }
      
      // Add current message to display as ChatMessage
      const chatMessage: ChatMessage = {
        id: `demo-${currentMessage}`,
        content: message.content,
        sender: message.sender,
        timestamp: new Date(),
        type: 'text'
      };
      
      setDisplayedMessages(prev => [...prev, chatMessage]);
      
      // Update activity data
      if (message.sender === 'agent') {
        setTimeout(() => {
          setActivityData(prev => ({ 
            ...prev, 
            isProcessing: false,
            currentAction: '',
            processingTime: Math.floor(Math.random() * 800) + 600
          }));
        }, 1000);
      }
      
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

  // Initialize chat history for the demo
  useEffect(() => {
    const history = {
      id: `demo-${currentDemo}`,
      title: currentConversation.title,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    };
    setChatHistories([history]);
  }, [currentDemo]);

  const getActionForMessageType = (type: string): string => {
    switch (type) {
      case 'greeting': return 'Initializing conversation...';
      case 'qualification': return 'Analyzing requirements...';
      case 'recommendation': return 'Matching server configurations...';
      case 'quote_generation': return 'Generating enterprise quotation...';
      case 'completion': return 'Finalizing quote delivery...';
      default: return 'Processing response...';
    }
  };

  const getTopicsForMessage = (content: string): string[] => {
    const topics = [];
    if (content.toLowerCase().includes('virtualization')) {
      topics.push('VMware vSphere', 'Hyper-V', 'Memory Optimization', 'High Availability');
    }
    if (content.toLowerCase().includes('database')) {
      topics.push('SQL Server', 'Oracle Database', 'Storage Performance', 'Backup Solutions');
    }
    if (content.toLowerCase().includes('ai') || content.toLowerCase().includes('machine learning')) {
      topics.push('GPU Acceleration', 'TensorFlow', 'Data Analytics', 'Model Training');
    }
    if (topics.length === 0) {
      topics.push('Server Consolidation', 'Power Efficiency', 'Scalability', 'Support Services');
    }
    return topics.slice(0, 4);
  };
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
    setActivityData(prev => ({ ...prev, isProcessing: false, currentAction: '', relatedTopics: [] }));
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
      if (onBackToLanding) {
        onBackToLanding();
      } else {
        nextDemo();
      }
    }, 1000);
  };

  const selectDemo = (index: number) => {
    setCurrentDemo(index);
    resetDemo();
  };

  const handleSendMessage = (content: string) => {
    // Demo is autoplay only, don't allow manual input
    console.log('Demo is autoplay mode');
  };

  const handleSelectChat = (chatId: string) => {
    // Only one demo chat in autoplay mode
  };

  const handleNewChat = () => {
    resetDemo();
  };

  const getProgressPercentage = () => {
    return Math.min((currentMessage / currentConversation.conversation.length) * 100, 100);
  };

  // Show quote screen if generated
  if (showQuote && generatedQuote) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-6 w-auto"
              />
              <div>
                <h2 className="text-lg font-semibold">🎉 Demo Complete - Quote Generated!</h2>
                <p className="text-[#01A982] text-xs">AI-Powered Sales Process Completed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onBackToLanding && (
                <Button
                  onClick={onBackToLanding}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Button>
              )}
              <Button
                onClick={handleCloseQuote}
                size="sm"
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close & Next Demo
              </Button>
            </div>
          </div>
          
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
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
        
        <div className="p-4">
          <QuoteDisplay 
            quoteData={generatedQuote}
            onClose={onBackToLanding || handleCloseQuote}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-6 w-auto"
            />
            <div>
              <h2 className="text-lg font-semibold">HPE AI Sales Assistant Demo</h2>
              <p className="text-[#01A982] text-xs">Live Conversation Simulation</p>
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
            <Button onClick={resetDemo} size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button onClick={nextDemo} size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
            {onBackToLanding && (
              <Button onClick={onBackToLanding} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Button>
            )}
            {onBackToLanding && (
              <Button onClick={onBackToLanding} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Home
              </Button>
            )}
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
        <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
          <div 
            className="bg-[#01A982] h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>

        {/* Current Demo Info */}
        <div className="grid md:grid-cols-2 gap-3 text-xs">
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

      {/* 3-Panel Chat Layout */}
      <div className="flex-1 flex">
        {/* Left Panel - Chat History (15%) */}
        <div className="w-[15%] bg-white border-r border-gray-200 flex flex-col">
          <ChatHistoryPanel
            chatHistories={chatHistories}
            currentChatId={chatHistories[0]?.id || ''}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onBackToLanding={onBackToLanding || (() => {})}
          />
        </div>

        {/* Middle Panel - Chat Window (70%) */}
        <div className="w-[70%] flex flex-col">
          <ChatWindow
            messages={displayedMessages}
            onSendMessage={handleSendMessage}
            isVoiceActive={false}
            activityData={activityData}
          />
        </div>

        {/* Right Panel - Activity Panel (15%) */}
        <div className="w-[15%] bg-gray-100 border-l border-gray-200">
          <ActivityPanel
            activityData={activityData}
            messageCount={displayedMessages.length}
          />
        </div>
      </div>

      {/* Demo Stats Footer */}
      <div className="bg-gray-100 px-4 py-3 border-t flex-shrink-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-base font-bold text-[#01A982]">
              {Math.round(currentConversation.conversation.length * 0.5)}s
            </div>
            <div className="text-xs text-gray-600">Time to Quote</div>
          </div>
          <div>
            <div className="text-base font-bold text-[#FF8300]">
              {currentConversation.conversation.filter(m => m.type === 'qualification').length}
            </div>
            <div className="text-xs text-gray-600">Qualifying Questions</div>
          </div>
          <div>
            <div className="text-base font-bold text-blue-600">
              {currentConversation.conversation.filter(m => m.type === 'recommendation').length}
            </div>
            <div className="text-xs text-gray-600">Server Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
}