import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';  
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatMessage, Customer, ServerProduct } from '../../types';
import { MessageCircle, X, Send, Mic, MicOff, Phone } from 'lucide-react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { LeadCaptureForm } from './LeadCaptureForm';
import { ServerRecommendation } from './ServerRecommendation';
import { QuoteGeneration } from './QuoteGeneration';
import { QuoteDisplay } from './QuoteDisplay';
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
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [showQuoteDisplay, setShowQuoteDisplay] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

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

    // Import server products for product data resolution
    const { default: serverProducts } = await import('../../data/serverProducts.json');

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
        // After demo completes, show final phase actions
        handleDemoCompletion(demoType, demoData);
        return;
      }

      const message = demoData.conversation[messageIndex];
      const nextMessage = demoData.conversation[messageIndex + 1];
      
      if (message.sender === 'agent') {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
          
          // Handle product data for recommendation messages
          let messageData = undefined;
          if (message.type === 'recommendation' && message.products) {
            // Convert product IDs to full product objects
            const fullProducts = message.products.map((productId: string) => 
              serverProducts.find(p => p.id === productId)
            ).filter(Boolean);
            messageData = { products: fullProducts };
          } else if (message.products) {
            messageData = { products: message.products };
          }
          
          addAgentMessage(message.content, message.type as any, messageData);
          
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
            // Trigger quote generation sequence
            setTimeout(() => {
              handleQuoteGeneration(demoData);
            }, 2000);
          } else if (message.type === 'escalation') {
            // Handle escalation to sales support
            setTimeout(() => {
              handleSalesEscalation(demoData);
            }, 1500);
          } else if (message.type === 'completion') {
            setPhase(CHAT_PHASES.COMPLETED);
            // Handle AE assignment
            setTimeout(() => {
              handleAEAssignment(demoData);
            }, 1000);
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

  const handleQuoteGeneration = (demoData: any) => {
    // Show quote generation progress
    addAgentMessage("Generating your customized HPE quote now...", 'quote');
    
    setTimeout(() => {
      addAgentMessage(
        `📄 **Quote Generated Successfully!**\n\nYour HPE ProLiant server quotation has been generated and sent to ${demoData.persona.email}. The quote includes:\n\n• Detailed server specifications\n• Competitive pricing with volume discounts\n• Standard warranty and support options\n• Implementation timeline\n\nQuote ID: HPE-${Date.now().toString().slice(-6)}`,
        'quote'
      );
      
      // Generate quote data for display
      const quoteData = {
        id: `HPE-${Date.now().toString().slice(-6)}`,
        customerInfo: {
          name: demoData.persona.name,
          company: demoData.persona.company,
          email: demoData.persona.email
        },
        products: [
          {
            model: 'HPE ProLiant DL380 Gen11',
            quantity: 2,
            unitPrice: 8400,
            totalPrice: 16800,
            configuration: {
              processor: '2x Intel Xeon Silver 4314 (2.4GHz, 16-core)',
              memory: '64GB DDR4-3200 ECC',
              storage: '4x 960GB SSD + 4x 4TB HDD',
              network: '4x 1GbE + 2x 10GbE SFP+',
              warranty: '3-year Next Business Day'
            }
          }
        ],
        pricing: {
          subtotal: 16800,
          discount: 1680,
          tax: 1363,
          total: 16483,
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
    }, 3000);
  };

  const handleAEAssignment = (demoData: any) => {
    const aeNames = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Thompson'];
    const territories = ['West Coast', 'East Coast', 'Central', 'International'];
    const randomAE = aeNames[Math.floor(Math.random() * aeNames.length)];
    const randomTerritory = territories[Math.floor(Math.random() * territories.length)];
    
    addAgentMessage(
      `👨‍💼 **Account Executive Assigned**\n\nI've assigned your account to **${randomAE}**, our Senior Account Executive for the ${randomTerritory} region.\n\n**What happens next:**\n• ${randomAE} will contact you within 24 hours\n• Technical consultation on your specific requirements\n• Custom configuration and pricing optimization\n• Implementation planning and support\n\n📞 You can expect a call from ${randomAE} tomorrow morning to discuss your project in detail.`,
      'completion'
    );
  };

  const handleSalesEscalation = (demoData: any) => {
    addAgentMessage(
      `🎧 **Connecting to Sales Support**\n\nI'm transferring you to our specialized sales support team who can address your technical requirements in detail.\n\n**Transfer Details:**\n• Complete conversation history included\n• Technical specialist standing by\n• Expected wait time: < 30 seconds\n\nPlease hold while I connect you...`,
      'escalation'
    );
    
    setTimeout(() => {
      addAgentMessage(
        `✅ **Connected to Sales Support**\n\nHi ${demoData.persona.name}, this is Jennifer from HPE Technical Sales Support. I have your complete conversation history and understand you need specialized assistance with your ${demoData.scenario.toLowerCase()}.\n\nHow can I help you with the technical details?`,
        'escalation'
      );
    }, 2000);
  };

  const handleDemoCompletion = (demoType: string, demoData: any) => {
    // Add final summary message
    setTimeout(() => {
      addAgentMessage(
        `🎯 **Demo Complete - End-to-End Sales Process**\n\n**What we accomplished:**\n• ⚡ Lead qualification in under 2 minutes\n• 🤖 AI-powered server recommendations\n• 📄 Instant HPE-branded quotation\n• 👨‍💼 Automatic AE assignment\n• 📊 CRM integration and follow-up scheduling\n\n**Customer: ${demoData.persona.name}**\n**Company: ${demoData.persona.company}**\n**Status: Qualified Lead with Quote Delivered**\n\nThis demonstrates HPE's AI-powered sales transformation!`,
        'completion'
      );
    }, 1000);
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
    
    // More sophisticated conversation logic
    if (message.includes('budget') || message.includes('cost') || message.includes('price')) {
      addAgentMessage(
        "Budget is definitely important for planning. Could you give me a rough range you're considering? This helps me recommend the most cost-effective solutions.\n\nFor context:\n• Entry-level servers: $3K-8K\n• Mid-range enterprise: $8K-25K\n• High-performance/mission-critical: $25K-100K+\n\nI'll make sure to provide options within your range!"
      );
      return;
    }
    
    if (message.includes('timeline') || message.includes('when') || message.includes('urgent')) {
      addAgentMessage(
        "Timeline is crucial for proper planning! Here's what I can offer:\n\n**Standard delivery:** 2-4 weeks\n**Expedited shipping:** 1-2 weeks (additional cost)\n**Express configuration:** Custom configs in 3-5 days\n**Emergency deployment:** 24-48 hours (subject to availability)\n\nWhat's your ideal timeline? I can adjust recommendations and pricing accordingly."
      );
      return;
    }
    
    if (message.includes('support') || message.includes('warranty') || message.includes('service')) {
      addAgentMessage(
        "Support is critical for business continuity! HPE offers comprehensive support options:\n\n**Included with every server:**\n• 3-year standard warranty\n• Online support portal access\n• Basic phone support\n\n**Premium options:**\n• 24x7 phone support with 2-hour response\n• Next business day hardware replacement\n• Remote monitoring and diagnostics\n• Dedicated account manager\n\nWhat level of support does your organization require?"
      );
      return;
    }
    
    if (message.includes('compare') || message.includes('versus') || message.includes('vs') || message.includes('alternative')) {
      addAgentMessage(
        "Great question! HPE ProLiant servers offer several advantages:\n\n**vs. Dell PowerEdge:**\n• Superior memory capacity and expansion\n• Better integrated management (iLO)\n• Higher reliability ratings\n\n**vs. Lenovo ThinkSystem:**\n• More comprehensive support ecosystem\n• Better software integration\n• Stronger enterprise features\n\n**vs. Public Cloud:**\n• 40-60% lower TCO for consistent workloads\n• Complete data control and security\n• Predictable performance\n\nWould you like detailed comparisons for your specific use case?"
      );
      return;
    }
    
    if (message.includes('security') || message.includes('compliance') || message.includes('hipaa') || message.includes('sox')) {
      addAgentMessage(
        "Security and compliance are paramount in today's environment. HPE ProLiant servers include:\n\n**Built-in Security Features:**\n• TPM 2.0 hardware security\n• Secure Boot with digital signatures\n• Runtime firmware verification\n• Hardware-based encryption\n\n**Compliance Certifications:**\n• FIPS 140-2 validation\n• Common Criteria certification\n• HIPAA pre-certification available\n• SOX compliance documentation\n\nWhat specific compliance requirements do you need to meet?"
      );
      return;
    }
    let recommendedProducts: ServerProduct[] = [];

    // Import server products
    const { default: serverProducts } = await import('../../data/serverProducts.json');
    
    if (message.includes('virtualization') || message.includes('vmware') || message.includes('hyper-v')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('virtualization'));
    } else if (message.includes('database') || message.includes('sql') || message.includes('oracle')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('database'));
      addAgentMessage(
        `**Database servers require optimized performance for your workloads!**\n\nBased on your database requirements, here are my HPE ProLiant recommendations:\n\n**Database-specific optimizations:**\n• High-performance storage (NVMe SSDs)\n• Maximum memory capacity for caching\n• Multi-core processors for concurrent queries\n• Enterprise reliability features\n\n**Let me fine-tune the recommendation:**\n• Which database platform? (SQL Server, Oracle, MySQL, PostgreSQL)\n• Database size and growth projections?\n• Number of concurrent users or connections?\n• Performance requirements (transactions/sec, query response time)?\n• High availability needs (clustering, replication)?\n\nI can configure the perfect database server for your needs!`,
        'recommendation',
        { products: recommendedProducts.slice(0, 2) }
      );
    } else if (message.includes('small') || message.includes('office') || message.includes('startup')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('small-business'));
      addAgentMessage(
        `**Perfect! Small business solutions need to be cost-effective yet reliable.**\n\nFor small business environments, I recommend these HPE ProLiant servers:\n\n**Small business benefits:**\n• Affordable entry point with room to grow\n• Easy management and setup\n• Quiet operation for office environments\n• Comprehensive warranty and support\n\n**Typical small business use cases:**\n• File and print sharing\n• Email and collaboration\n• Business applications\n• Backup and data protection\n\n**To customize your solution:**\n• How many employees will use the server?\n• Primary applications or services needed?\n• Office environment or dedicated server room?\n• Budget considerations?\n\nLet me configure the ideal small business server for you!`,
        'recommendation',
        { products: recommendedProducts.slice(0, 2) }
      );
    } else if (message.includes('ai') || message.includes('machine learning') || message.includes('analytics')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('ai-ml'));
      addAgentMessage(
        `**AI and Machine Learning workloads require specialized hardware!**\n\nBased on your requirements, I recommend these HPE ProLiant servers optimized for AI/ML:\n\n**Key considerations for your AI workloads:**\n• GPU acceleration capabilities\n• High-bandwidth memory for large datasets\n• Fast storage for model training\n• Scalable architecture for growing demands\n\n**Follow-up questions to optimize your recommendation:**\n• Are you primarily doing model training or inference?\n• What frameworks are you using? (TensorFlow, PyTorch, etc.)\n• Dataset sizes and memory requirements?\n• GPU preferences? (NVIDIA A100, H100, etc.)\n\nWould you like me to configure a system with GPU acceleration?`,
        'recommendation',
        { products: recommendedProducts.slice(0, 2) }
      );
    } else if (message.includes('enterprise') || message.includes('large') || message.includes('scale')) {
      recommendedProducts = serverProducts.filter(p => p.useCases.includes('enterprise'));
      addAgentMessage(
        `**Enterprise-scale infrastructure requires robust, reliable solutions!**\n\nFor large-scale deployments, I recommend these enterprise-class HPE ProLiant servers:\n\n**Enterprise features you'll benefit from:**\n• Mission-critical reliability and redundancy\n• Advanced management and monitoring\n• Comprehensive support and services\n• Scalable architecture for growth\n\n**Let me understand your enterprise requirements:**\n• How many users will this support?\n• High availability requirements?\n• Integration with existing infrastructure?\n• Compliance or regulatory requirements?\n\nShall I configure an enterprise solution for you?`,
        'recommendation', 
        { products: recommendedProducts.slice(0, 2) }
      );
    } else {
      // Default recommendations
      recommendedProducts = serverProducts.slice(0, 2);
      addAgentMessage(
        `**Thank you for sharing your requirements!** Based on what you've told me, here are my initial HPE ProLiant server recommendations:\n\n**To provide the most accurate recommendation, could you help me understand:**\n• Primary use case or workload type?\n• Expected number of users or applications?\n• Performance requirements or constraints?\n• Budget considerations?\n• Timeline for implementation?\n\n**I can also help with:**\n• Custom configurations\n• Pricing and financing options\n• Support and warranty plans\n• Implementation services\n\nWhat specific questions do you have about these servers?`,
        'recommendation',
        { products: recommendedProducts.slice(0, 2) }
      );
      addAgentMessage(
        `**Virtualization infrastructure is one of our specialties!**\n\nFor VMware and Hyper-V environments, these HPE ProLiant servers are optimized for virtual workloads:\n\n**Virtualization-specific benefits:**\n• High memory capacity for multiple VMs\n• Multi-core processors for VM density\n• SR-IOV networking for performance\n• VMware certification and optimization\n\n**Key planning questions:**\n• How many VMs are you planning to run?\n• Average VM memory requirements?\n• Current virtualization platform? (VMware vSphere, Hyper-V, KVM)\n• Host count and consolidation goals?\n• Storage requirements (local vs. shared)?\n\nI can design the perfect virtualization platform for your needs!`,
        'recommendation',
        { products: recommendedProducts.slice(0, 2) }
      );
    }

    setRecommendations(recommendedProducts.slice(0, 2));
    setPhase(CHAT_PHASES.RECOMMENDATION);
  };

  const handleProductApproval = (products: ServerProduct[]) => {
    if (isAutoPlaying) return;
    
    addAgentMessage(
      "**Excellent choice!** I'm now generating a comprehensive, enterprise-grade quotation tailored specifically to your requirements.\n\n**What I'm preparing for you:**\n• Detailed server specifications and configurations\n• Competitive pricing with volume discounts\n• Comprehensive support and warranty options\n• Implementation timeline and professional services\n• Financing alternatives including HPE GreenLake\n\n**While I prepare your quote, I'm also:**\n• Assigning you to a specialized account executive\n• Scheduling follow-up technical consultation\n• Preparing reference customer introductions\n• Setting up proof-of-concept opportunities\n\n**Your customized HPE quotation will be ready momentarily!**"
    );
    setPhase(CHAT_PHASES.QUOTATION);
    
    setTimeout(() => {
      addAgentMessage(
        "🎉 **Your HPE quotation is complete!**\n\n**Quote Details:**\n• Professional PDF with HPE branding\n• Detailed technical specifications\n• Competitive pricing and discounts\n• Support options and warranties\n• Implementation timeline\n\n**Account Executive Assignment:**\nI've connected you with one of our senior account executives who specializes in your type of deployment. They'll contact you within 4 hours to:\n• Review the quotation in detail\n• Answer technical questions\n• Discuss implementation planning\n• Provide reference customers\n• Arrange proof-of-concept if needed\n\n**Next steps:** Check your email for the complete quotation package!",
        'quote',
        { products, customer }
      );
      setPhase(CHAT_PHASES.COMPLETED);
      
      // Generate quote data for manual interaction
      const quoteData = {
        id: `HPE-${Date.now().toString().slice(-6)}`,
        customerInfo: customer as any,
        products: products.map(p => ({
          model: p.model,
          quantity: 1,
          unitPrice: p.pricing.basePrice,
          totalPrice: p.pricing.basePrice,
          configuration: {
            processor: p.specifications.processors,
            memory: p.specifications.memory,
            storage: p.specifications.storage,
            network: '4x 1GbE + 2x 10GbE SFP+',
            warranty: '3-year Next Business Day'
          }
        })),
        pricing: {
          subtotal: products.reduce((sum, p) => sum + p.pricing.basePrice, 0),
          discount: Math.round(products.reduce((sum, p) => sum + p.pricing.basePrice, 0) * 0.1),
          tax: Math.round(products.reduce((sum, p) => sum + p.pricing.basePrice, 0) * 0.08),
          total: Math.round(products.reduce((sum, p) => sum + p.pricing.basePrice, 0) * 0.98),
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
    }, 2000);
  };

  const handleQuoteComplete = (quoteData: any) => {
    setGeneratedQuote(quoteData);
  };

  const handleViewQuote = () => {
    setShowQuoteDisplay(true);
  };

  const handleCloseQuoteDisplay = () => {
    setShowQuoteDisplay(false);
  };

  const handleEscalation = () => {
    addAgentMessage("I'm connecting you with our sales support team. Please hold on while I transfer your conversation...");
    // In a real implementation, this would trigger the escalation flow
  };

  // Show quote display if requested
  if (showQuoteDisplay && generatedQuote) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0F2027]">HPE Server Quotation</h2>
            <Button variant="ghost" onClick={handleCloseQuoteDisplay}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6">
            <QuoteDisplay 
              quoteData={generatedQuote}
              onClose={handleCloseQuoteDisplay}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full h-16 w-16 bg-[#01A982] hover:bg-[#018f73] shadow-lg"
        >
          <MessageCircle className="h-12 w-12" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMaximized ? 'w-[800px] h-[700px]' : 'w-96 h-[600px]'
    }`}>
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
              className={`text-white hover:bg-white/20 ${isVoiceActive ? 'bg-white/30' : 'bg-gray-600/70'}`}
            >
              {isVoiceActive ? <Phone className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMaximize}
              className="text-white hover:bg-white/20 bg-gray-600/70"
              title={isMaximized ? 'Minimize chat' : 'Maximize chat'}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20 bg-gray-600/70"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>  
        </div>

        {/* Demo Tags */}
        {messages.length <= 1 && !isAutoPlaying && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <p className="text-xs text-gray-600 mb-3">💡 Try these demo scenarios:</p>
            <div className="flex flex-wrap gap-2 justify-start">
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
            <div className="space-y-4">
              <QuoteGeneration 
                customerInfo={customer as any}
                serverProducts={recommendations}
                onQuoteComplete={handleQuoteComplete}
              />
              {generatedQuote && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#01A982]">Quote Ready!</p>
                      <p className="text-sm text-gray-600">Your detailed HPE quotation is available for review</p>
                    </div>
                    <Button 
                      onClick={handleViewQuote}
                      className="bg-[#01A982] hover:bg-[#018f73]"
                    >
                      View Quote
                    </Button>
                  </div>
                </div>
              )}
            </div>
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