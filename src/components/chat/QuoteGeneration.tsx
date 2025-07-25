import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Loader2, FileText, Mail, User } from 'lucide-react';

export function QuoteGeneration() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Analyzing requirements...');

  useEffect(() => {
    const steps = [
      { progress: 20, step: 'Analyzing requirements...' },
      { progress: 40, step: 'Configuring servers...' },
      { progress: 60, step: 'Calculating pricing...' },
      { progress: 80, step: 'Generating PDF quote...' },
      { progress: 90, step: 'Assigning account executive...' },
      { progress: 100, step: 'Complete!' }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setProgress(steps[currentStepIndex].progress);
        setCurrentStep(steps[currentStepIndex].step);
        currentStepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-orange-50 border-orange-200">
      <CardContent>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#FF8300] rounded-full flex items-center justify-center mx-auto">
            {progress === 100 ? (
              <FileText className="h-8 w-8 text-white" />
            ) : (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {progress === 100 ? 'Quote Generated!' : 'Generating Your Quote'}
            </h3>
            <p className="text-sm text-gray-600">{currentStep}</p>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#FF8300] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {progress === 100 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                <Mail className="h-4 w-4" />
                <span>Quote sent to your email</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                <User className="h-4 w-4" />
                <span>Assigned to Sarah Johnson, Senior AE</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}