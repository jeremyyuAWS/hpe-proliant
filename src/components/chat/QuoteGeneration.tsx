import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader2, FileText, Mail, User, CheckCircle, Server, Calculator, DollarSign, Clock } from 'lucide-react';

interface QuoteGenerationProps {
  customerInfo?: {
    name: string;
    company: string;
    email: string;
  };
  serverProducts?: any[];
  onQuoteComplete?: (quoteData: any) => void;
}

export function QuoteGeneration({ customerInfo, serverProducts, onQuoteComplete }: QuoteGenerationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing quote generation...');
  const [stepDetails, setStepDetails] = useState('');
  const [quoteData, setQuoteData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Prevent multiple runs
    if (!isGenerating) return;
    
    let timeouts: NodeJS.Timeout[] = [];
    let isCleanedUp = false;
    
    const steps = [
      { 
        progress: 15, 
        step: 'Analyzing customer requirements...', 
        details: 'Processing workload specifications and performance needs',
        icon: Server
      },
      { 
        progress: 30, 
        step: 'Configuring server specifications...', 
        details: 'Optimizing processor, memory, and storage configurations',
        icon: Server
      },
      { 
        progress: 45, 
        step: 'Calculating volume pricing...', 
        details: 'Applying enterprise discounts and support packages',
        icon: Calculator
      },
      { 
        progress: 60, 
        step: 'Generating warranty options...', 
        details: 'Including HPE Pointnext services and support tiers',
        icon: CheckCircle
      },
      { 
        progress: 75, 
        step: 'Creating PDF documentation...', 
        details: 'Formatting professional HPE-branded quotation',
        icon: FileText
      },
      { 
        progress: 90, 
        step: 'Assigning account executive...', 
        details: 'Matching with specialized sales representative',
        icon: User
      },
      { 
        progress: 100, 
        step: 'Quote generation complete!', 
        details: 'Ready for customer review and approval',
        icon: CheckCircle
      }
    ];

    const processNextStep = () => {
      steps.forEach((step, index) => {
        const timeout = setTimeout(() => {
          if (isCleanedUp) return;
          
          setProgress(step.progress);
          setCurrentStep(step.step);
          setStepDetails(step.details);
        
          if (index === steps.length - 1) {
            // Generate quote data when complete
            const generatedQuote = {
              id: `HPE-${Date.now().toString().slice(-6)}`,
              customerId: 'customer-' + Date.now(),
              customerInfo: customerInfo || {
                name: 'John Smith',
                company: 'TechCorp Inc',
                email: 'john@techcorp.com'
              },
              products: serverProducts || [
                {
                  model: 'HPE ProLiant DL380 Gen11',
                  quantity: 2,
                  unitPrice: 8400,
                  totalPrice: 16800,
                  configuration: {
                    processor: '2x Intel Xeon Silver 4314 (2.4GHz, 16-core)',
                    memory: '64GB DDR4-3200 ECC',
                    storage: '4x 960GB SSD + 4x 4TB HDD',
                    network: '4x 1GbE + 2x 10GbE SFP+',
                    warranty: '3-year Next Business Day'
                  }
                }
              ],
              pricing: {
                subtotal: 16800,
                discount: 1680,
                tax: 1363,
                total: 16483,
                currency: 'USD'
              },
              createdAt: new Date(),
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              assignedAE: {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@hpe.com',
                phone: '+1-415-555-0123',
                territory: 'West Coast'
              },
              status: 'generated'
            };
            
            setQuoteData(generatedQuote);
            setIsGenerating(false);
            if (onQuoteComplete) {
              onQuoteComplete(generatedQuote);
            }
          }
        }, 500 + (index * 800));
        
        timeouts.push(timeout);
      });
    };
    
    processNextStep();
    
    return () => {
      isCleanedUp = true;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isGenerating]);

  // Reset when props change
  useEffect(() => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Initializing quote generation...');
    setStepDetails('');
    setQuoteData(null);
  }, [customerInfo, serverProducts]);
            id: `HPE-${Date.now().toString().slice(-6)}`,
            customerId: 'customer-' + Date.now(),
            customerInfo: customerInfo || {
              name: 'John Smith',
              company: 'TechCorp Inc',
              email: 'john@techcorp.com'
            },
            products: serverProducts || [
              {
                model: 'HPE ProLiant DL380 Gen11',
                quantity: 2,
                unitPrice: 8400,
                totalPrice: 16800,
                configuration: {
                  processor: '2x Intel Xeon Silver 4314 (2.4GHz, 16-core)',
                  memory: '64GB DDR4-3200 ECC',
                  storage: '4x 960GB SSD + 4x 4TB HDD',
                  network: '4x 1GbE + 2x 10GbE SFP+',
                  warranty: '3-year Next Business Day'
                }
              }
            ],
            pricing: {
              subtotal: 16800,
              discount: 1680,
              tax: 1363,
              total: 16483,
              currency: 'USD'
            },
            createdAt: new Date(),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            assignedAE: {
              name: 'Sarah Johnson',
              email: 'sarah.johnson@hpe.com',
              phone: '+1-415-555-0123',
              territory: 'West Coast'
            },
            status: 'generated'
          };
          
          setQuoteData(generatedQuote);
          if (onQuoteComplete) {
            onQuoteComplete(generatedQuote);
          }
          // Clear interval after completion
          clearInterval(intervalId);
          return;
        }
        
        currentStepIndex++;
        // Schedule next step
        intervalId = setTimeout(processNextStep, 800);
      } else {
        clearInterval(intervalId);
      }
    };
    
    const interval = setTimeout(processNextStep, 500);
    
    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
      clearTimeout(interval);
    };
  }, [customerInfo, serverProducts, onQuoteComplete]);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-green-50 border-orange-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF8300] to-[#01A982] rounded-full flex items-center justify-center mx-auto shadow-lg">
            {progress === 100 ? (
              <CheckCircle className="h-10 w-10 text-white" />
            ) : (
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-[#0F2027] mb-2">
              {progress === 100 ? '🎉 HPE Quote Generated!' : '⚡ Generating Your Custom Quote'}
            </h3>
            <p className="text-lg text-gray-700 font-medium">{currentStep}</p>
            <p className="text-sm text-gray-600 mt-1">{stepDetails}</p>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#FF8300] to-[#01A982] h-3 rounded-full transition-all duration-700 flex items-center justify-end pr-1"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Processing Steps Indicator */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              progress >= 30 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <Server className="h-3 w-3" />
              <span>Configuration</span>
            </div>
            <div className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              progress >= 60 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <DollarSign className="h-3 w-3" />
              <span>Pricing</span>
            </div>
            <div className={`flex items-center space-x-1 p-2 rounded-lg transition-colors ${
              progress >= 90 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <FileText className="h-3 w-3" />
              <span>Documentation</span>
            </div>
          </div>
          
          {progress === 100 && quoteData && (
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <h4 className="font-bold text-[#01A982] mb-3">Quote Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quote ID:</span>
                        <span className="font-mono font-semibold">{quoteData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Value:</span>
                        <span className="font-bold text-[#01A982] text-lg">
                          ${quoteData.pricing.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until:</span>
                        <span>{quoteData.validUntil.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <h4 className="font-bold text-[#FF8300] mb-3">Your Account Executive</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{quoteData.assignedAE.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{quoteData.assignedAE.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Will contact within 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-[#01A982] hover:bg-[#018f73]">
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF Quote
                </Button>
                <Button variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Quote
                </Button>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900">Next Steps</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your quote has been sent to {quoteData.customerInfo.email}. 
                      {quoteData.assignedAE.name} will contact you to discuss implementation details and answer any questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}