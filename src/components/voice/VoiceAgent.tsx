import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from 'lucide-react';

interface VoiceAgentProps {
  isActive: boolean;
  onToggle: () => void;
}

export function VoiceAgent({ isActive, onToggle }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');

  useEffect(() => {
    if (isActive && !isConnected) {
      // Simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setAgentResponse("Hi! I'm your HPE voice assistant. I can help you find the perfect ProLiant server. What can I help you with today?");
      }, 1000);
    }
  }, [isActive, isConnected]);

  const handleStartListening = () => {
    setIsListening(true);
    // Simulate speech recognition
    setTimeout(() => {
      setTranscript("I need a server for virtualization workloads with about 50 virtual machines");
      setIsListening(false);
      
      // Simulate AI response
      setTimeout(() => {
        setAgentResponse("For 50 virtual machines, I recommend the HPE ProLiant DL380 Gen11. It's perfect for virtualization with excellent performance and reliability. Would you like me to tell you more about its specifications?");
      }, 1500);
    }, 3000);
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsListening(false);
    setTranscript('');
    setAgentResponse('');
    onToggle();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 mx-4">
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className="w-20 h-20 bg-gradient-to-r from-[#01A982] to-[#FF8300] rounded-full flex items-center justify-center mx-auto">
              <Volume2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold">HPE Voice Assistant</h2>
            <p className="text-sm text-gray-600">
              {isConnected ? 'Connected - Speak naturally' : 'Connecting...'}
            </p>
          </div>

          {isConnected && (
            <>
              <div className="space-y-4">
                {agentResponse && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-[#01A982] rounded-full flex items-center justify-center flex-shrink-0">
                        <Volume2 className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-sm text-left">
                        <p className="text-gray-600 font-medium">AI Assistant:</p>
                        <p className="text-gray-800">{agentResponse}</p>
                      </div>
                    </div>
                  </div>
                )}

                {transcript && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mic className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-sm text-left">
                        <p className="text-gray-600 font-medium">You said:</p>
                        <p className="text-gray-800">{transcript}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleStartListening}
                  disabled={isListening}
                  className={`w-16 h-16 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-[#01A982] hover:bg-[#018f73]'
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-6 w-6" />
                  ) : (
                    <Mic className="h-6 w-6" />
                  )}
                </Button>
                
                <Button
                  onClick={handleEndCall}
                  variant="secondary"
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                {isListening ? 'Listening... Speak now' : 'Click the microphone to speak'}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}