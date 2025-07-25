import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Mail, Phone, Download, Share, User, Calendar, DollarSign, Server, Shield, Clock } from 'lucide-react';

interface QuoteDisplayProps {
  quoteData: {
    id: string;
    customerInfo: {
      name: string;
      company: string;
      email: string;
    };
    products: Array<{
      model: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      configuration: {
        processor: string;
        memory: string;
        storage: string;
        network: string;
        warranty: string;
      };
    }>;
    pricing: {
      subtotal: number;
      discount: number;
      tax: number;
      total: number;
      currency: string;
    };
    createdAt: Date;
    validUntil: Date;
    assignedAE: {
      name: string;
      email: string;
      phone: string;
      territory: string;
    };
    status: string;
  };
  onClose?: () => void;
}

export function QuoteDisplay({ quoteData, onClose }: QuoteDisplayProps) {
  const handleDownloadPDF = () => {
    // In a real implementation, this would generate and download the PDF
    console.log('Downloading PDF quote:', quoteData.id);
  };

  const handleEmailQuote = () => {
    // In a real implementation, this would send the quote via email
    console.log('Emailing quote to:', quoteData.customerInfo.email);
  };

  const handleScheduleCall = () => {
    // In a real implementation, this would open calendar scheduling
    console.log('Scheduling call with:', quoteData.assignedAE.name);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">HPE ProLiant Server Quotation</h1>
                <p className="text-[#01A982] font-medium">Quote ID: {quoteData.id}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Generated: {quoteData.createdAt.toLocaleDateString()}</p>
              <p className="text-sm opacity-80">Valid Until: {quoteData.validUntil.toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Customer Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#01A982] mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-semibold">{quoteData.customerInfo.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Company:</span>
                  <p className="font-semibold">{quoteData.customerInfo.company}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-semibold">{quoteData.customerInfo.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#FF8300] mb-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Your Account Executive
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-semibold">{quoteData.assignedAE.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Territory:</span>
                  <p className="font-semibold">{quoteData.assignedAE.territory}</p>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <Button variant="outline" size="sm" onClick={handleScheduleCall}>
                    <Phone className="mr-1 h-3 w-3" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-1 h-3 w-3" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Configuration */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#01A982] mb-4 flex items-center">
              <Server className="mr-2 h-5 w-5" />
              Recommended Server Configuration
            </h3>
            
            {quoteData.products.map((product, index) => (
              <div key={index} className="border rounded-lg p-6 mb-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-[#0F2027]">{product.model}</h4>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#01A982]">
                      ${product.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${product.unitPrice.toLocaleString()} per unit
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Technical Specifications</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600 shrink-0">Processor:</span>
                        <span>{product.configuration.processor}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600 shrink-0">Memory:</span>
                        <span>{product.configuration.memory}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600 shrink-0">Storage:</span>
                        <span>{product.configuration.storage}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600 shrink-0">Network:</span>
                        <span>{product.configuration.network}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Shield className="mr-1 h-4 w-4" />
                      Support & Warranty
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{product.configuration.warranty}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>HPE Pointnext Services Included</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>24/7 Technical Support</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Remote Monitoring Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-[#0F2027] mb-4 flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Investment Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${quoteData.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Volume Discount (10%):</span>
                <span>-${quoteData.pricing.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax & Fees:</span>
                <span>${quoteData.pricing.tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-[#01A982]">
                  <span>Total Investment:</span>
                  <span>${quoteData.pricing.total.toLocaleString()} {quoteData.pricing.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#0F2027] mb-4">Terms & Conditions</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>This quotation is valid for 30 days from the date of issue.</span>
              </div>
              <div className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Pricing includes standard configuration, warranty, and HPE Pointnext services.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Estimated delivery: 2-4 weeks from order confirmation.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <span>Final pricing may vary based on configuration changes and current promotions.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 bg-[#01A982] hover:bg-[#018f73]"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF Quote
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1"
              onClick={handleEmailQuote}
            >
              <Mail className="mr-2 h-5 w-5" />
              Email Quote
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={handleScheduleCall}
            >
              <Phone className="mr-2 h-5 w-5" />
              Schedule Call with AE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add CheckCircle import
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);