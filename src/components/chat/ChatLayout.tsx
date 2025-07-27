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
    const lowercaseMessage = message.toLowerCase();
    
    // Phase 1: Requirements Gathering
    if (conversationPhase === 'requirements') {
      setConversationPhase('qualification');
      return `Thank you for reaching out! I'm your HPE AI Sales Advisor, and I'm here to help you find the perfect ProLiant server solution.

I understand you're looking for servers for **${message}**. To provide you with the most accurate recommendations, I'll need to gather some additional information about your specific requirements.

**Let me ask a few qualifying questions:**

1. **What's your primary use case?** (e.g., virtualization, database, web hosting, AI/ML, general purpose)
2. **How many users or VMs will you be supporting?**
3. **Do you have any specific performance requirements?** (CPU, memory, storage needs)
4. **What's your preferred form factor?** (rack mount, tower, blade)
5. **What's your approximate budget range?**

Feel free to answer these in any order, or let me know if you need help understanding any of these requirements!`;
    }
    
    // Phase 2: Qualification - Analyze responses and ask follow-ups
    if (conversationPhase === 'qualification') {
      // Store requirements (simplified logic)
      const requirements = analyzeRequirements(message);
      setCustomerRequirements(requirements);
      
      if (requirements.needsMoreInfo) {
        return `Great information! Based on what you've told me, I have a good understanding of your ${requirements.useCase} requirements.

Just a couple more questions to ensure I recommend the perfect solution:

${requirements.followUpQuestions.join('\n')}

Once I have these details, I'll be able to provide you with specific HPE ProLiant server recommendations with pricing.`;
      } else {
        setConversationPhase('recommendation');
        const recommended = recommendServers(requirements);
        setRecommendedProducts(recommended);
        
        return generateRecommendationResponse(recommended, requirements);
      }
    }
    
    // Phase 3: Recommendation approved - Generate quotation
    if (conversationPhase === 'recommendation' && (lowercaseMessage.includes('yes') || lowercaseMessage.includes('approve') || lowercaseMessage.includes('quote') || lowercaseMessage.includes('proceed'))) {
      setConversationPhase('quotation');
      return `Excellent! I'll generate a comprehensive HPE quotation for you right away.

**What I'm preparing for you:**
• Detailed server specifications and configurations
• Competitive pricing with volume discounts
• Warranty and support options
• Implementation timeline and next steps

This will take just a moment... 🔄

While I'm preparing your quote, I'm also assigning you to one of our experienced HPE account executives who will be your dedicated point of contact for this project.`;
    }
    
    // Phase 4: Escalation to sales support
    if (lowercaseMessage.includes('help') || lowercaseMessage.includes('support') || lowercaseMessage.includes('speak to someone') || lowercaseMessage.includes('technical')) {
      setConversationPhase('escalation');
      return `I understand you'd like to speak with one of our technical specialists. Let me connect you with our expert sales support team right away.

**What's happening next:**
• I'm transferring our complete conversation history
• A senior sales engineer will join this chat shortly
• They'll have full context of your requirements and can provide detailed technical consultation

Please hold for just a moment while I connect you... 🎧`;
    }
    
    // Default response for other questions
    return `I'm here to help you find the right HPE ProLiant server solution. Could you tell me more about your specific server requirements? For example:

• What workloads will you be running?
• How many users or applications will be supported?
• Do you have any specific performance needs?

The more details you provide, the better I can recommend the perfect server configuration for your needs!`;
  };

  const analyzeRequirements = (message: string): any => {
    const lowercaseMessage = message.toLowerCase();
    const requirements: any = {
      useCase: 'general purpose',
      needsMoreInfo: false,
      followUpQuestions: []
    };

    // Determine use case
    if (lowercaseMessage.includes('virtualization') || lowercaseMessage.includes('vmware') || lowercaseMessage.includes('hyper-v')) {
      requirements.useCase = 'virtualization';
    } else if (lowercaseMessage.includes('database') || lowercaseMessage.includes('sql') || lowercaseMessage.includes('oracle')) {
      requirements.useCase = 'database';
    } else if (lowercaseMessage.includes('ai') || lowercaseMessage.includes('machine learning') || lowercaseMessage.includes('gpu')) {
      requirements.useCase = 'ai-ml';
    } else if (lowercaseMessage.includes('web') || lowercaseMessage.includes('hosting')) {
      requirements.useCase = 'web';
    } else if (lowercaseMessage.includes('small business') || lowercaseMessage.includes('office')) {
      requirements.useCase = 'small-business';
    }

    // Check if we have enough info (simplified logic)
    const hasUserCount = /\d+/.test(message) && (lowercaseMessage.includes('user') || lowercaseMessage.includes('vm') || lowercaseMessage.includes('employee'));
    const hasFormFactor = lowercaseMessage.includes('rack') || lowercaseMessage.includes('tower') || lowercaseMessage.includes('blade');
    const hasBudget = lowercaseMessage.includes('$') || lowercaseMessage.includes('budget') || lowercaseMessage.includes('price');

    if (!hasUserCount) {
      requirements.followUpQuestions.push('• How many users, VMs, or concurrent connections do you expect?');
      requirements.needsMoreInfo = true;
    }
    
    if (!hasFormFactor) {
      requirements.followUpQuestions.push('• Do you prefer rack mount servers, tower servers, or blade systems?');
      requirements.needsMoreInfo = true;
    }

    return requirements;
  };

  const recommendServers = (requirements: any): ServerProduct[] => {
    const products = serverProducts as ServerProduct[];
    
    // Simple recommendation logic based on use case
    switch (requirements.useCase) {
      case 'virtualization':
        return products.filter(p => p.useCases.includes('virtualization')).slice(0, 2);
      case 'database':
        return products.filter(p => p.useCases.includes('database')).slice(0, 2);
      case 'ai-ml':
        return products.filter(p => p.useCases.includes('ai-ml')).slice(0, 1);
      case 'small-business':
        return products.filter(p => p.useCases.includes('small-business')).slice(0, 1);
      default:
        return products.slice(0, 2);
    }
  };

  const generateRecommendationResponse = (products: ServerProduct[], requirements: any): string => {
    const productList = products.map((product, index) => 
      `**${index + 1}. ${product.model}**
• ${product.description}
• Form Factor: ${product.specifications.formFactor}
• Processors: ${product.specifications.processors}
• Memory: ${product.specifications.memory}
• Starting Price: **$${product.pricing.basePrice.toLocaleString()}**`
    ).join('\n\n');

    return `Perfect! Based on your ${requirements.useCase} requirements, I recommend the following HPE ProLiant servers:

${productList}

**Why these recommendations?**
• Optimized for ${requirements.useCase} workloads
• Proven reliability and performance
• Industry-leading warranty and support
• Scalable to grow with your business

**Next Steps:**
Would you like me to generate a detailed quotation for any of these servers? I can also customize the configuration to better match your specific needs.

Just say "yes" or "generate quote" and I'll prepare your HPE-branded quotation immediately!`;
    }
  };

  const extractRelatedTopics = (message: string): string[] => {
    const serverTopicMap: Record<string, string[]> = {
      'virtualization': ['VMware vSphere', 'Hyper-V', 'Memory Optimization', 'High Availability', 'Disaster Recovery'],
      'database': ['SQL Server', 'Oracle Database', 'MySQL', 'Storage Performance', 'Backup Solutions'],
      'ai-ml': ['GPU Acceleration', 'TensorFlow', 'PyTorch', 'Data Analytics', 'Model Training'],
      'web': ['Load Balancing', 'Web Applications', 'Content Delivery', 'SSL Certificates', 'Security'],
      'small-business': ['File Sharing', 'Email Server', 'Domain Controller', 'Backup', 'Remote Access'],
      'default': ['Server Consolidation', 'Power Efficiency', 'Scalability', 'Warranty Options', 'Support Services']
    };

    const lowercaseMessage = message.toLowerCase();
    if (lowercaseMessage.includes('virtualization') || lowercaseMessage.includes('vmware')) {
      return serverTopicMap.virtualization;
    } else if (lowercaseMessage.includes('database') || lowercaseMessage.includes('sql')) {
      return serverTopicMap.database;
    } else if (lowercaseMessage.includes('ai') || lowercaseMessage.includes('machine learning')) {
      return serverTopicMap['ai-ml'];
    } else if (lowercaseMessage.includes('web') || lowercaseMessage.includes('hosting')) {
      return serverTopicMap.web;
    } else if (lowercaseMessage.includes('small business')) {
      return serverTopicMap['small-business'];
    } else {
      return serverTopicMap.default;
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