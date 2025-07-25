import React from 'react';
import { Button } from '../ui/Button';
import { MessageCircle, Mic } from 'lucide-react';

interface HeroSectionProps {
  onStartChat: () => void;
  onStartVoice: () => void;
}

export function HeroSection({ onStartChat, onStartVoice }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold leading-tight">
                Transform Your Infrastructure with 
                <span className="text-[#01A982]"> AI-Powered Server Solutions</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Get personalized HPE ProLiant server recommendations and instant quotes in under 2 minutes. 
                Our AI sales advisor understands your workload requirements and provides tailored solutions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#01A982] rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">24/7 AI Advisor Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#FF8300] rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Instant Quotations</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#01A982]">
                ⚡ Get Your Custom Quote in Under 2 Minutes
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onStartChat}
                  className="bg-[#01A982] hover:bg-[#018f73] text-white"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Chat with AI Sales Advisor
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={onStartVoice}
                  className="bg-[#FF8300] hover:bg-[#e67600]"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Talk to Voice Agent
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                AI-Powered Recommendations
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Instant Quotations
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                Expert Sales Support
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <img 
                src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="HPE ProLiant Server"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="mt-6 space-y-2">
                <h3 className="text-xl font-semibold">HPE ProLiant DL380 Gen11</h3>
                <p className="text-gray-300">The industry's most trusted compute platform</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#01A982] font-semibold">Starting at $4,200</span>
                  <span className="text-sm text-gray-400">2U Rack Server</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-[#01A982] to-[#FF8300] rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}