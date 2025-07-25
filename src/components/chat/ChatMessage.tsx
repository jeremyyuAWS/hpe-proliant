import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { Button } from '../ui/Button';
import { User, Bot, PhoneCall } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: ChatMessageType;
  onEscalation?: () => void;
}

export function ChatMessage({ message, onEscalation }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-[#01A982] ml-2' : 'bg-gray-200 mr-2'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-600" />
          )}
        </div>
        
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-[#01A982] text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <p className="text-sm">{message.content}</p>
          
          {message.type === 'recommendation' && message.data?.products && (
            <div className="mt-3 space-y-2">
              {message.data.products.map((product: any) => (
                <div key={product.id} className="bg-white/10 rounded-lg p-3 text-xs">
                  <div className="font-semibold">{product.model}</div>
                  <div className="opacity-80">{product.category}</div>
                  <div className="mt-1 font-medium">
                    Starting at ${product.pricing.basePrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isUser && onEscalation && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEscalation}
                className="text-xs text-gray-600 hover:text-[#01A982]"
              >
                <PhoneCall className="h-3 w-3 mr-1" />
                Talk to Human Agent
              </Button>
            </div>
          )}
          
          <div className={`text-xs mt-2 opacity-60 ${isUser ? 'text-white' : 'text-gray-500'}`}>
            {format(message.timestamp, 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
}