import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatMessage } from '../../types';
import { Send, Mic, MicOff, User, Bot, Copy, ThumbsUp, ThumbsDown, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isVoiceActive?: boolean;
  activityData: {
    isProcessing: boolean;
    currentAction: string;
    relatedTopics: string[];
    sourceCount: number;
    processingTime: number;
  };
}

export function ChatWindow({ messages, onSendMessage, isVoiceActive = false, activityData }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsTyping(activityData.isProcessing);
  }, [activityData.isProcessing]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .split('\n').map((line, index) => {
        if (line.includes('<li>')) {
          return `<ul>${line}</ul>`;
        }
        return line;
      }).join('<br>');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#01A982] rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">HPE ProLiant Sales Advisor</h2>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200">
                  {isTyping ? 'Analyzing requirements...' : 'Ready to help'}
                </span>
                {activityData.sourceCount > 0 && (
                  <>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-300">{activityData.sourceCount} server models</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={`text-white hover:bg-white/20 ${isVoiceActive ? 'bg-white/20' : ''}`}
            >
              {isVoiceActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Processing Status */}
        {isTyping && activityData.currentAction && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-[#01A982]">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-[#01A982] rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{activityData.currentAction}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">HPE ProLiant Expert Ready!</h3>
            <p className="text-gray-500">Tell me about your server requirements and I'll find the perfect HPE ProLiant solution for you.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-500 ml-3' : 'bg-[#01A982] mr-3'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                
                <div className={`rounded-2xl px-6 py-4 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  <div className="space-y-2">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessageContent(message.content) 
                      }}
                    />
                    
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/50">
                      <span className={`text-xs ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(message.timestamp, 'HH:mm')}
                      </span>
                      
                      {message.sender === 'agent' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-green-600"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-[#01A982] rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-6 py-4 border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me more about your requirements..."
              className="pr-12 h-12 text-base"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 top-2 h-8 w-8 p-0 bg-[#01A982] hover:bg-[#018f73] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}