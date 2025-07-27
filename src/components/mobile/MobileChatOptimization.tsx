import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  MessageCircle, Send, Mic, Phone, Menu, X, 
  ChevronDown, ChevronUp, Maximize2, Minimize2,
  User, Bot, Smartphone, Monitor
} from 'lucide-react';

interface MobileChatOptimizationProps {
  onDeviceChange: (device: 'mobile' | 'desktop') => void;
  currentDevice: 'mobile' | 'desktop';
}

export function MobileChatOptimization({ onDeviceChange, currentDevice }: MobileChatOptimizationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: "Hi! I'm your HPE AI Sales Advisor. I can help you find the perfect server solution. What's your project about?",
      sender: 'agent' as const,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: "Great! Let me help you find the right HPE ProLiant server. Could you tell me more about your workload requirements?",
        sender: 'agent' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const MobileView = () => (
    <div className="max-w-sm mx-auto bg-gray-900 rounded-3xl p-2 shadow-2xl">
      {/* Mobile Device Frame */}
      <div className="bg-black rounded-2xl overflow-hidden">
        {/* Status Bar */}
        <div className="bg-black text-white px-4 py-2 flex justify-between text-xs">
          <span>9:41</span>
          <div className="flex space-x-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-1 h-2 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* App Content */}
        <div className="bg-white h-[600px] flex flex-col">
          {/* Mobile Header */}
          <div className="bg-[#01A982] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-6 w-auto"
              />
              <div>
                <div className="font-semibold text-sm">HPE AI Sales</div>
                <div className="text-xs opacity-80">Online now</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-[#01A982] mr-2'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 max-w-full ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-6 h-6 bg-[#01A982] rounded-full flex items-center justify-center mr-2">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Input */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="pr-20 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Mic className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage}
                    className="h-6 w-6 p-0 bg-[#01A982] hover:bg-[#018f73]"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DesktopView = () => (
    <div className="bg-gray-100 rounded-2xl p-8 max-w-4xl mx-auto">
      {/* Desktop Browser Frame */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Browser Header */}
        <div className="bg-gray-200 px-4 py-3 flex items-center space-x-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-600">
            hpe.com/ai-sales-assistant
          </div>
        </div>

        {/* Desktop Content */}
        <div className="h-[500px] flex">
          {/* Chat History Sidebar */}
          <div className="w-1/4 bg-gray-50 border-r">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 text-sm">Chat History</h3>
            </div>
            <div className="p-2 space-y-1">
              {['Current Conversation', 'Database Requirements', 'Virtualization Setup'].map((chat, index) => (
                <div key={index} className={`p-3 rounded-lg text-sm cursor-pointer ${
                  index === 0 ? 'bg-[#01A982]/10 text-[#01A982]' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  {chat}
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#01A982] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                  alt="HPE Logo" 
                  className="h-6 w-auto"
                />
                <div>
                  <div className="font-semibold">HPE AI Sales Advisor</div>
                  <div className="text-xs opacity-80">Enterprise chat experience</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'bg-blue-500 ml-3' : 'bg-[#01A982] mr-3'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#01A982] rounded-full flex items-center justify-center mr-3">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Panel */}
          <div className="w-1/5 bg-gray-50 border-l p-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-4">Activity</h4>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="bg-white rounded-lg p-2">
                <div className="font-medium">Processing...</div>
                <div>Analyzing requirements</div>
              </div>
              <div className="bg-white rounded-lg p-2">
                <div className="font-medium">Sources</div>
                <div>8 server models</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
              <h2 className="text-xl font-semibold">Mobile-Optimized Chat Experience</h2>
              <p className="text-[#01A982] text-sm">Responsive design across all devices</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onDeviceChange('mobile')}
              size="sm"
              className={currentDevice === 'mobile' ? 'bg-[#01A982]' : 'bg-gray-600'}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
            <Button
              onClick={() => onDeviceChange('desktop')}
              size="sm"
              className={currentDevice === 'desktop' ? 'bg-[#01A982]' : 'bg-gray-600'}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
          </div>
        </div>

        {/* Device Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#01A982]">87%</div>
            <div className="text-xs text-gray-300">Mobile Users</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-[#FF8300]">4.9</div>
            <div className="text-xs text-gray-300">Mobile Rating</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">2.1s</div>
            <div className="text-xs text-gray-300">Mobile Load Time</div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        {currentDevice === 'mobile' ? <MobileView /> : <DesktopView />}
        
        {/* Mobile Optimization Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#01A982]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-6 w-6 text-[#01A982]" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Touch-Optimized</h4>
              <p className="text-sm text-gray-600">Large touch targets, swipe gestures, and thumb-friendly navigation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#FF8300]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mic className="h-6 w-6 text-[#FF8300]" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Voice Integration</h4>
              <p className="text-sm text-gray-600">Hands-free interaction perfect for mobile users on the go</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Fast Performance</h4>
              <p className="text-sm text-gray-600">Optimized for mobile networks with offline capability</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}