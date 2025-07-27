import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { User, Bot, MessageSquare, Users, Play, Pause, SkipForward } from 'lucide-react';

interface CustomerSession {
  id: string;
  customer: {
    name: string;
    company: string;
    avatar: string;
    location: string;
  };
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: Date;
  }>;
  status: 'active' | 'quoted' | 'completed';
  startTime: Date;
}

export function MultiUserDemo() {
  const [sessions, setSessions] = useState<CustomerSession[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>('');

  const customerProfiles = [
    {
      name: 'Alex Kim',
      company: 'InnovateTech Startup',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'San Francisco, CA',
      scenario: 'startup-scaling'
    },
    {
      name: 'Dr. Maria Rodriguez',
      company: 'DataFlow Analytics',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'New York, NY',
      scenario: 'database-analytics'
    },
    {
      name: 'Robert Chen',
      company: 'Precision Manufacturing',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Detroit, MI',
      scenario: 'manufacturing-edge'
    },
    {
      name: 'Dr. Amanda Foster',
      company: 'Regional Medical Center',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      location: 'Houston, TX',
      scenario: 'healthcare-compliance'
    }
  ];

  const conversationFlow = {
    'startup-scaling': [
      { sender: 'user', content: "We're a startup looking to move from cloud to hybrid infrastructure for cost savings." },
      { sender: 'agent', content: "Perfect! Many growing companies optimize costs with hybrid infrastructure. What's your current monthly cloud spend?" },
      { sender: 'user', content: "About $40K/month on AWS. We're 50 people now, growing to 100+ this year." },
      { sender: 'agent', content: "That's excellent growth! For your scale, I recommend HPE ProLiant DL360 Gen11 servers. You could save $20K+ monthly." }
    ],
    'database-analytics': [
      { sender: 'user', content: "Need high-performance servers for real-time analytics and machine learning workloads." },
      { sender: 'agent', content: "AI and analytics require serious compute power! What's your typical dataset size and query volume?" },
      { sender: 'user', content: "Processing 50TB active data, 200+ concurrent queries, need sub-second response times." },
      { sender: 'agent', content: "For those demanding requirements, I recommend HPE ProLiant DL580 Gen11 with GPU acceleration and all-NVMe storage." }
    ],
    'manufacturing-edge': [
      { sender: 'user', content: "Implementing IoT sensors for predictive maintenance in our manufacturing plant." },
      { sender: 'agent', content: "Smart factory initiatives are transformative! How many production lines and what environmental conditions?" },
      { sender: 'user', content: "12 production lines, 200+ sensors, dusty environment up to 40°C, need real-time safety alerts." },
      { sender: 'agent', content: "For industrial environments, I recommend HPE Edgeline EL4000 systems - ruggedized and designed for manufacturing floors." }
    ],
    'healthcare-compliance': [
      { sender: 'user', content: "Upgrading our data center for new EHR system, everything must be HIPAA compliant." },
      { sender: 'agent', content: "Healthcare infrastructure is mission-critical! Which EHR platform and how many users?" },
      { sender: 'user', content: "Epic implementation, 1,500 users across 3 locations, heavy medical imaging, need 99.9% uptime." },
      { sender: 'agent', content: "For Epic and medical imaging, I recommend HPE ProLiant DL580 Gen11 with HIPAA pre-certification and mission-critical support." }
    ]
  };

  useEffect(() => {
    if (isRunning) {
      // Initialize sessions
      const initialSessions = customerProfiles.map((profile, index) => ({
        id: `session-${index}`,
        customer: profile,
        messages: [],
        status: 'active' as const,
        startTime: new Date(Date.now() - Math.random() * 10 * 60 * 1000)
      }));
      setSessions(initialSessions);

      // Simulate conversations
      let messageIndex = 0;
      const interval = setInterval(() => {
        if (messageIndex >= 4) {
          clearInterval(interval);
          return;
        }

        setSessions(prev => prev.map(session => {
          const flow = conversationFlow[session.customer.scenario as keyof typeof conversationFlow];
          if (flow && messageIndex < flow.length) {
            const newMessage = {
              id: `msg-${session.id}-${messageIndex}`,
              content: flow[messageIndex].content,
              sender: flow[messageIndex].sender as 'user' | 'agent',
              timestamp: new Date()
            };
            
            return {
              ...session,
              messages: [...session.messages, newMessage],
              status: messageIndex === 3 ? 'quoted' as const : session.status
            };
          }
          return session;
        }));

        messageIndex++;
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const startDemo = () => {
    setIsRunning(true);
    setSessions([]);
  };

  const stopDemo = () => {
    setIsRunning(false);
    setSessions([]);
  };

  const getTotalConversations = () => sessions.reduce((sum, s) => sum + s.messages.length, 0);
  const getActiveCount = () => sessions.filter(s => s.status === 'active').length;
  const getQuotedCount = () => sessions.filter(s => s.status === 'quoted').length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h2 className="text-xl font-semibold">Multi-User AI Sales Demo</h2>
              <p className="text-[#01A982] text-sm">Simultaneous Customer Interactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={isRunning ? stopDemo : startDemo}
              size="sm"
              className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-[#01A982] hover:bg-[#018f73]"}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Real-time Stats */}
        {isRunning && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#01A982]">{sessions.length}</div>
              <div className="text-xs text-gray-300">Active Sessions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#FF8300]">{getTotalConversations()}</div>
              <div className="text-xs text-gray-300">Total Messages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{getActiveCount()}</div>
              <div className="text-xs text-gray-300">In Progress</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{getQuotedCount()}</div>
              <div className="text-xs text-gray-300">Quotes Generated</div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {!isRunning ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Multi-User Demo Ready</h3>
            <p className="text-gray-500 mb-6">
              Watch multiple customers interact with HPE AI Sales Assistant simultaneously
            </p>
            <Button onClick={startDemo} size="lg" className="bg-[#01A982] hover:bg-[#018f73]">
              <Play className="h-5 w-5 mr-2" />
              Start Multi-User Demo
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Customer Sessions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0F2027] mb-4">Active Customer Sessions</h3>
              {sessions.map((session) => (
                <Card 
                  key={session.id} 
                  className={`cursor-pointer transition-all ${
                    selectedSession === session.id ? 'ring-2 ring-[#01A982]' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={session.customer.avatar}
                          alt={session.customer.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-sm">{session.customer.name}</div>
                          <div className="text-xs text-gray-600">{session.customer.company}</div>
                          <div className="text-xs text-gray-500">{session.customer.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          session.status === 'quoted' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {Math.floor((Date.now() - session.startTime.getTime()) / 60000)}m ago
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <MessageSquare className="h-3 w-3" />
                      <span>{session.messages.length} messages</span>
                      {session.messages.length > 0 && (
                        <>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <span>Last: {session.messages[session.messages.length - 1].content.substring(0, 30)}...</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Conversation */}
            <div>
              <h3 className="font-semibold text-[#0F2027] mb-4">Conversation Details</h3>
              {selectedSession ? (
                <Card className="h-96">
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {sessions.find(s => s.id === selectedSession)?.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-[#01A982] mr-2'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="h-3 w-3 text-white" />
                              ) : (
                                <Bot className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className={`rounded-xl px-3 py-2 text-sm ${
                              message.sender === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96">
                  <CardContent className="p-4 h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Select a customer session to view conversation</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}