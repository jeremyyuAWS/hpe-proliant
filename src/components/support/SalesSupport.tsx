import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatMessage } from '../../types';
import { User, Headphones, Send, Clock, CheckCircle } from 'lucide-react';

interface SalesSupportProps {
  chatHistory: ChatMessage[];
  customerInfo: {
    name: string;
    company: string;
    email: string;
  };
  onClose: () => void;
}

export function SalesSupport({ chatHistory, customerInfo, onClose }: SalesSupportProps) {
  const [message, setMessage] = useState('');
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'waiting' | 'connected' | 'resolved'>('waiting');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setSupportMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your question. I've reviewed your conversation history and I'm here to help. Let me connect you with our technical specialist who can provide detailed information about server configurations for your specific requirements.",
        sender: 'agent',
        timestamp: new Date(),
        type: 'text'
      };
      setSupportMessages(prev => [...prev, agentResponse]);
      setStatus('connected');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl mx-4 h-[80vh] bg-white rounded-2xl flex">
        {/* Chat History Panel */}
        <div className="w-1/3 bg-gray-50 p-6 border-r overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-semibold text-[#0F2027] mb-2">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{customerInfo.name}</span>
              </div>
              <div>
                <strong>Company:</strong> {customerInfo.company}
              </div>
              <div>
                <strong>Email:</strong> {customerInfo.email}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#0F2027] mb-4">Chat History</h3>
            <div className="space-y-3">
              {chatHistory.map((msg) => (
                <div key={msg.id} className={`text-xs p-3 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <div className="font-medium mb-1">
                    {msg.sender === 'user' ? customerInfo.name : 'AI Agent'}
                  </div>
                  <div className="text-gray-700">{msg.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Chat Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-[#01A982] text-white p-6 rounded-tr-2xl">
            <div className="flex items-center justify-between">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-8 w-auto mr-4"
              />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">HPE Expert Sales Support</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'waiting' ? 'bg-yellow-400' :
                      status === 'connected' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm opacity-80">
                      {status === 'waiting' ? 'Connecting to specialist...' :
                       status === 'connected' ? 'Senior Sales Engineer Online' : 'Case Resolved'}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20">
                ×
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {status === 'waiting' && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Connecting you with a sales support specialist...</p>
                <p className="text-sm text-gray-500 mt-2">Average wait time: 30 seconds</p>
              </div>
            )}

            <div className="space-y-4">
              {supportMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' ? 'bg-[#01A982] text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-2 opacity-60`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {status === 'connected' && supportMessages.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Issue Resolved</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Thank you for contacting HPE sales support. Your case has been documented and our AI system has been updated with this information.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          {status !== 'waiting' && (
            <div className="p-6 border-t">
              <div className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}