import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, Users, MessageSquare } from 'lucide-react';

interface VideoCallSimulationProps {
  isActive: boolean;
  onEnd: () => void;
  customerName: string;
  customerCompany: string;
}

export function VideoCallSimulation({ isActive, onEnd, customerName, customerCompany }: VideoCallSimulationProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (isActive) {
      // Simulate connection delay
      const connectTimer = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

      // Start call timer
      const durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectTimer);
        clearInterval(durationTimer);
      };
    }
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onEnd();
    }, 1000);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-black rounded-2xl overflow-hidden">
        {/* Video Call Interface */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-8 w-auto"
              />
              <div className="text-white">
                <div className="font-semibold">HPE Sales Consultation</div>
                <div className="text-sm text-gray-300">
                  {callStatus === 'connecting' ? 'Connecting...' : 
                   callStatus === 'connected' ? `Connected • ${formatDuration(callDuration)}` : 'Call Ended'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-4 w-4" />
              <span className="text-sm">2 participants</span>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 grid grid-cols-2 gap-4 p-4">
            {/* Customer Video */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={customerName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-white font-semibold">{customerName}</div>
                <div className="text-gray-300 text-sm">{customerCompany}</div>
              </div>
              {callStatus === 'connecting' && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-[#01A982] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Connecting to {customerName}...</p>
                  </div>
                </div>
              )}
            </div>

            {/* HPE Sales Engineer Video */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden">
              {isScreenSharing ? (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 font-semibold">HPE ProLiant Server Specifications</div>
                    <div className="text-sm text-gray-500 mt-2">Screen sharing active</div>
                    
                    {/* Mock Server Spec Display */}
                    <div className="bg-gray-100 rounded-lg p-6 mt-6 max-w-md mx-auto text-left">
                      <h3 className="font-bold text-[#0F2027] mb-4">HPE ProLiant DL380 Gen11</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processors:</span>
                          <span>2x Intel Xeon Scalable</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Memory:</span>
                          <span>Up to 8TB DDR5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Storage:</span>
                          <span>Up to 30 SFF drives</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Form Factor:</span>
                          <span>2U Rack</span>
                        </div>
                        <div className="flex justify-between font-semibold text-[#01A982] pt-2 border-t">
                          <span>Starting Price:</span>
                          <span>$4,200</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="HPE Sales Engineer"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-white font-semibold">Sarah Johnson</div>
                <div className="text-gray-300 text-sm">HPE Senior Account Executive</div>
              </div>
            </div>
          </div>

          {/* Conversation Simulation */}
          {callStatus === 'connected' && (
            <div className="bg-gray-900 p-4">
              <div className="bg-gray-800 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
                <div className="space-y-2 text-sm">
                  <div className="text-white">
                    <span className="text-[#01A982] font-semibold">Sarah:</span> Thanks for joining the call, {customerName}. I've reviewed your AI conversation and understand you need servers for {customerCompany}. Let me share some specific recommendations...
                  </div>
                  <div className="text-white">
                    <span className="text-blue-400 font-semibold">{customerName}:</span> Great! I'm particularly interested in the performance specifications and support options.
                  </div>
                  <div className="text-white">
                    <span className="text-[#01A982] font-semibold">Sarah:</span> Perfect! Let me screen share the detailed specifications for the ProLiant DL380 Gen11...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-gray-900 p-6 flex items-center justify-center space-x-4">
            <Button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`rounded-full h-12 w-12 ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isMicOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
            </Button>
            
            <Button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`rounded-full h-12 w-12 ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
            </Button>

            <Button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`rounded-full h-12 w-12 ${isScreenSharing ? 'bg-[#01A982] hover:bg-[#018f73]' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Monitor className="h-5 w-5 text-white" />
            </Button>

            <Button
              onClick={handleEndCall}
              className="rounded-full h-12 w-12 bg-red-500 hover:bg-red-600"
            >
              <PhoneOff className="h-5 w-5 text-white" />
            </Button>

            <Button
              className="rounded-full h-12 w-12 bg-gray-700 hover:bg-gray-600"
            >
              <MessageSquare className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}