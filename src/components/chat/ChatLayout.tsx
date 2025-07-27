import React, { useState, useEffect, useRef } from 'react';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import { ChatWindow } from './ChatWindow';
import { ActivityPanel } from './ActivityPanel';
import { ChatMessage } from '../../types';
import { TransitionHandler } from './TransitionHandler';

interface ChatLayoutProps {
  initialMessage: string;
  onBackToLanding: () => void;
  isVoiceActive?: boolean;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

export function ChatLayout({ initialMessage, onBackToLanding, isVoiceActive = false }: ChatLayoutProps) {
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(true);
  const [activityData, setActivityData] = useState({
    isProcessing: false,
    currentAction: '',
    relatedTopics: [] as string[],
    sourceCount: 0,
    processingTime: 0
  });

  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Initialize first conversation
  useEffect(() => {
    const chatId = `chat-${Date.now()}`;
    setCurrentChatId(chatId);
    
    // Start with user's initial message
    const initialUserMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: initialMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentMessages([initialUserMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      setActivityData(prev => ({ ...prev, isProcessing: true, currentAction: 'Analyzing your question...' }));
    }, 500);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: generateAIResponse(initialMessage),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };

      setCurrentMessages(prev => [...prev, aiResponse]);
      
      // Create chat history entry
      const newHistory: ChatHistory = {
        id: chatId,
        title: initialMessage.substring(0, 50) + '...',
        messages: [initialUserMessage, aiResponse],
        createdAt: new Date(),
        lastActivity: new Date()
      };

      setChatHistories([newHistory]);
      setActivityData(prev => ({ 
        ...prev, 
        isProcessing: false, 
        currentAction: '',
        relatedTopics: extractRelatedTopics(initialMessage),
        sourceCount: Math.floor(Math.random() * 8) + 3,
        processingTime: Math.floor(Math.random() * 1500) + 800
      }));
    }, 3000);

    // Animation delay
    setTimeout(() => setIsAnimating(false), 300);
  }, [initialMessage]);

  const generateAIResponse = (message: string): string => {
    const responses = {
      'genai': `Based on the latest HFS research, GenAI is transforming enterprises through:

**Key Trends:**
• 73% of organizations are implementing GenAI for process automation
• Investment in GenAI platforms increased by 340% in 2024
• Customer service and content creation are the top use cases

**Strategic Recommendations:**
1. Start with pilot projects in low-risk areas
2. Invest in data quality and governance first
3. Develop internal AI literacy and training programs

**Market Leaders:**
Microsoft Azure OpenAI, AWS Bedrock, and Google Vertex AI are dominating the enterprise space.

Would you like me to dive deeper into any specific aspect of GenAI adoption?`,
      
      'cloud': `Cloud migration strategies have evolved significantly based on our latest research:

**Top 5 Migration Strategies:**
1. **Lift & Shift** - Quick migration with minimal changes (30% of projects)
2. **Re-platforming** - Optimize for cloud without major architecture changes
3. **Refactoring** - Redesign applications for cloud-native benefits
4. **Hybrid-First** - Strategic mix of on-premises and cloud resources
5. **Multi-Cloud** - Distribute workloads across multiple providers

**Key Success Factors:**
• Executive sponsorship and clear ROI metrics
• Comprehensive staff training and change management
• Phased approach with pilot projects
• Strong security and compliance framework

**Cost Optimization:**
Organizations typically see 20-30% cost savings within 18 months when migration is properly planned.

What specific aspect of cloud migration would you like to explore further?`,

      'default': `Thank you for your question about "${message}". Based on HFS Research insights and current market analysis:

**Key Insights:**
• This topic is seeing significant enterprise adoption
• Organizations are investing heavily in related technologies
• Best practices are still emerging across industries

**Strategic Considerations:**
1. Assess current organizational readiness
2. Develop a comprehensive implementation roadmap
3. Invest in change management and training
4. Establish clear success metrics and KPIs

**Market Trends:**
Leading organizations are taking a measured approach, starting with pilot projects and scaling based on proven results.

I can provide more specific guidance if you'd like to focus on a particular aspect of this topic. What would be most helpful for your situation?`
    };

    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('genai') || lowercaseMessage.includes('ai')) {
      return responses.genai;
    } else if (lowercaseMessage.includes('cloud')) {
      return responses.cloud;
    } else {
      return responses.default;
    }
  };

  const extractRelatedTopics = (message: string): string[] => {
    const topicMap: Record<string, string[]> = {
      'genai': ['Machine Learning', 'Automation', 'NLP', 'Computer Vision', 'AI Ethics'],
      'cloud': ['DevOps', 'Containerization', 'Microservices', 'Security', 'Cost Optimization'],
      'default': ['Digital Transformation', 'Innovation', 'Technology Strategy', 'Market Analysis']
    };

    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('genai') || lowercaseMessage.includes('ai')) {
      return topicMap.genai;
    } else if (lowercaseMessage.includes('cloud')) {
      return topicMap.cloud;
    } else {
      return topicMap.default;
    }
  };

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    setActivityData(prev => ({ ...prev, isProcessing: true, currentAction: 'Processing your question...' }));

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: generateAIResponse(content),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };

      setCurrentMessages(prev => [...prev, aiResponse]);
      
      // Update current chat history
      setChatHistories(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, userMessage, aiResponse], lastActivity: new Date() }
          : chat
      ));

      setActivityData(prev => ({ 
        ...prev, 
        isProcessing: false,
        currentAction: '',
        relatedTopics: extractRelatedTopics(content),
        sourceCount: Math.floor(Math.random() * 8) + 3,
        processingTime: Math.floor(Math.random() * 1500) + 800
      }));
    }, 2500);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setCurrentMessages(selectedChat.messages);
      setActivityData(prev => ({
        ...prev,
        relatedTopics: extractRelatedTopics(selectedChat.messages[0]?.content || ''),
        sourceCount: Math.floor(Math.random() * 8) + 3
      }));
    }
  };

  const handleNewChat = () => {
    const chatId = `chat-${Date.now()}`;
    setCurrentChatId(chatId);
    setCurrentMessages([]);
    setActivityData({
      isProcessing: false,
      currentAction: '',
      relatedTopics: [],
      sourceCount: 0,
      processingTime: 0
    });
  };

  return (
    <TransitionHandler isAnimating={isAnimating}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Panel - Chat History (20%) */}
        <div className="w-1/5 bg-white border-r border-gray-200 flex flex-col">
          <ChatHistoryPanel
            chatHistories={chatHistories}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onBackToLanding={onBackToLanding}
          />
        </div>

        {/* Middle Panel - Chat Window (70%) */}
        <div className="w-7/10 flex flex-col" ref={chatWindowRef}>
          <ChatWindow
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            isVoiceActive={isVoiceActive}
            activityData={activityData}
          />
        </div>

        {/* Right Panel - Activity Panel (10%) */}
        <div className="w-1/10 bg-gray-100 border-l border-gray-200">
          <ActivityPanel
            activityData={activityData}
            messageCount={currentMessages.length}
          />
        </div>
      </div>
    </TransitionHandler>
  );
}