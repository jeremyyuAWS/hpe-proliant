import React from 'react';
import { Button } from '../ui/Button';
import { ChatHistory } from './ChatLayout';
import { MessageCircle, Plus, ArrowLeft, Clock, Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface ChatHistoryPanelProps {
  chatHistories: ChatHistory[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onBackToLanding: () => void;
}

export function ChatHistoryPanel({ 
  chatHistories, 
  currentChatId, 
  onSelectChat, 
  onNewChat, 
  onBackToLanding 
}: ChatHistoryPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredHistories = chatHistories.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToLanding}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <img 
            src="/Hewlett-Packard-Enterprise-Logo-1.png" 
            alt="HPE Logo" 
            className="h-6 w-auto"
          />
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-[#01A982] hover:bg-[#018f73] text-white justify-start"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 h-8 text-sm"
          />
        </div>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto">
        {filteredHistories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredHistories.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-gray-100 ${
                  currentChatId === chat.id ? 'bg-[#01A982]/10 border-l-2 border-[#01A982]' : ''
                }`}
              >
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                    {chat.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(chat.lastActivity)}</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span>{chat.messages.length} msgs</span>
                  </div>
                  {chat.messages.length > 0 && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {chat.messages[chat.messages.length - 1].content.substring(0, 80)}...
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">HPE ProLiant Sales Advisor</p>
          <p className="text-xs text-[#01A982] font-medium">Powered by HPE AI</p>
        </div>
      </div>
    </div>
  );
}