import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Mail, Phone, Download, Share, User, Calendar, DollarSign, Server, Shield, Clock, Check, Award, Truck, HeadphonesIcon, Globe, CreditCard } from 'lucide-react';

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
    console.log('Downloading PDF quote:', quoteData.id);
  };

  const handleEmailQuote = () => {
    console.log('Emailing quote to:', quoteData.customerInfo.email);
  };

  const handleScheduleCall = () => {
    console.log('Scheduling call with:', quoteData.assignedAE.name);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white">
      {/* Professional Header */}
      <CardHeader className="bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-12 w-auto"
            />
            <div className="border-l border-white/30 pl-6">
              <h1 className="text-3xl font-bold">Server Quotation</h1>
              <p className="text-[#01A982] font-semibold text-lg">Quote #{quoteData.id}</p>
              <p className="text-sm opacity-80">Hewlett Packard Enterprise</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">Quote Date</p>
              <p className="font-semibold text-lg">{formatDate(quoteData.createdAt)}</p>
              <p className="text-sm opacity-80 mt-2">Valid Until</p>
              <p className="font-semibold">{formatDate(quoteData.validUntil)}</p>
            </div>
          </div>
        </div>
        
        {/* Company Tagline */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-center text-lg font-medium text-[#01A982]">
            "Advance. Don't just adapt."
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Quote Summary Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#01A982]">${quoteData.pricing.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF8300]">{quoteData.products.reduce((sum, p) => sum + p.quantity, 0)}</div>
              <div className="text-sm text-gray-600 font-medium">Server Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2-4 Weeks</div>
              <div className="text-sm text-gray-600 font-medium">Delivery Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3 Years</div>
              <div className="text-sm text-gray-600 font-medium">Warranty Period</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Customer & Sales Rep Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#0F2027] mb-4 flex items-center">
                <User className="mr-3 h-6 w-6 text-[#01A982]" />
                Bill To
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{quoteData.customerInfo.name}</div>
                  <div className="text-gray-600">{quoteData.customerInfo.company}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{quoteData.customerInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">United States</span>
                </div>
              </div>
            </div>

            <div className="bg-[#01A982]/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#0F2027] mb-4 flex items-center">
                <Award className="mr-3 h-6 w-6 text-[#FF8300]" />
                Your HPE Account Executive
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{quoteData.assignedAE.name}</div>
                  <div className="text-gray-600">Senior Account Executive</div>
                  <div className="text-sm text-gray-500">{quoteData.assignedAE.territory} Territory</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{quoteData.assignedAE.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{quoteData.assignedAE.phone}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleScheduleCall}>
                    <Phone className="mr-1 h-3 w-3" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-1 h-3 w-3" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Configuration Details */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#0F2027] mb-6 flex items-center">
              <Server className="mr-3 h-7 w-7 text-[#01A982]" />
              HPE ProLiant Server Configuration
            </h3>
            
            {quoteData.products.map((product, index) => (
              <div key={index} className="border rounded-xl p-8 mb-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=200"
                      alt={product.model}
                      className="w-20 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="text-2xl font-bold text-[#0F2027]">{product.model}</h4>
                      <p className="text-gray-600 font-medium">High-Performance Rack Server</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-[#01A982]/10 text-[#01A982] px-3 py-1 rounded-full text-sm font-medium">
                          Qty: {product.quantity}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          2U Rack Mount
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#01A982]">
                      ${product.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      ${product.unitPrice.toLocaleString()} per unit
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Configuration Total
                    </div>
                  </div>
                </div>

                {/* Detailed Technical Specifications */}
                <div className="grid lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h5 className="font-bold text-gray-800 mb-4 flex items-center">
                      <Server className="mr-2 h-5 w-5 text-[#01A982]" />
                      Core Specifications
                    </h5>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Processors:</span>
                        <span className="text-right text-gray-800 max-w-xs">{product.configuration.processor}</span>
                      </div>
                      <div className="flex items-start justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Memory:</span>
                        <span className="text-right text-gray-800 max-w-xs">{product.configuration.memory}</span>
                      </div>
                      <div className="flex items-start justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Storage:</span>
                        <span className="text-right text-gray-800 max-w-xs">{product.configuration.storage}</span>
                      </div>
                      <div className="flex items-start justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Network:</span>
                        <span className="text-right text-gray-800 max-w-xs">{product.configuration.network}</span>
                      </div>
                      <div className="flex items-start justify-between py-2">
                        <span className="text-gray-600 font-medium">Form Factor:</span>
                        <span className="text-right text-gray-800 max-w-xs">2U Rack Mount</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-800 mb-4 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-[#FF8300]" />
                      Support & Services Included
                    </h5>
                    <div className="space-y-3">
                      {[
                        { icon: Check, text: product.configuration.warranty, color: "text-green-600" },
                        { icon: Check, text: "HPE Pointnext Tech Care Essential", color: "text-green-600" },
                        { icon: Check, text: "24x7 Hardware Support", color: "text-green-600" },
                        { icon: Check, text: "Remote Monitoring & Diagnostics", color: "text-green-600" },
                        { icon: Check, text: "Software Updates & Patches", color: "text-green-600" },
                        { icon: Check, text: "HPE MySupport Portal Access", color: "text-green-600" },
                        { icon: Check, text: "Installation & Startup Service", color: "text-green-600" },
                        { icon: Check, text: "Configuration Backup Service", color: "text-green-600" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm text-gray-700">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h6 className="font-semibold text-blue-900 mb-2">📋 Configuration Notes</h6>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Server includes HPE iLO 6 Standard for remote management</li>
                    <li>• All drives configured in RAID 1+0 for optimal performance and redundancy</li>
                    <li>• Network adapters support SR-IOV for virtualization optimization</li>
                    <li>• Energy Star certified for efficient power consumption</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Comprehensive Pricing Breakdown */}
          <div className="bg-gray-50 rounded-xl p-8 mb-10">
            <h3 className="text-2xl font-bold text-[#0F2027] mb-6 flex items-center">
              <CreditCard className="mr-3 h-7 w-7 text-[#01A982]" />
              Investment Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Hardware Subtotal:</span>
                <span className="text-xl font-semibold">${quoteData.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <span className="text-green-600 font-medium">Volume Discount (10%):</span>
                  <p className="text-sm text-gray-500">Enterprise pricing applied</p>
                </div>
                <span className="text-xl font-semibold text-green-600">-${quoteData.pricing.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <span className="text-gray-700 font-medium">HPE Pointnext Services:</span>
                  <p className="text-sm text-gray-500">3-year tech care essential</p>
                </div>
                <span className="text-xl font-semibold">$2,400</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <div>
                  <span className="text-gray-700 font-medium">Shipping & Handling:</span>
                  <p className="text-sm text-gray-500">White glove delivery service</p>
                </div>
                <span className="text-xl font-semibold">$450</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Tax & Fees:</span>
                <span className="text-xl font-semibold">${quoteData.pricing.tax.toLocaleString()}</span>
              </div>
              
              <div className="bg-gradient-to-r from-[#01A982]/10 to-[#FF8300]/10 rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-[#0F2027]">Total Investment:</span>
                    <p className="text-sm text-gray-600">All-inclusive enterprise solution</p>    
                  </div>
                  <span className="text-4xl font-bold text-[#01A982]">
                    ${quoteData.pricing.total.toLocaleString()} {quoteData.pricing.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 text-center">
                <CreditCard className="h-8 w-8 text-[#01A982] mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Payment Terms</div>
                <div className="text-sm text-gray-600">Net 30 Days</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Truck className="h-8 w-8 text-[#FF8300] mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Delivery</div>
                <div className="text-sm text-gray-600">2-4 Weeks ARO</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Warranty</div>
                <div className="text-sm text-gray-600">3 Years NBD</div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-[#0F2027] mb-6">Terms & Conditions</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Quote Validity</p>
                      <p className="text-blue-700">This quotation is valid for 30 days from the date of issue. Pricing subject to change after expiration.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Pricing Terms</p>
                      <p className="text-blue-700">All prices are in USD and include standard configuration, warranty, and HPE Pointnext services as specified.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Delivery Terms</p>
                      <p className="text-blue-700">Estimated delivery time is 2-4 weeks ARO (After Receipt of Order). Expedited shipping available upon request.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Warranty Coverage</p>
                      <p className="text-blue-700">Includes 3-year Next Business Day hardware warranty with parts and labor coverage.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HeadphonesIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Support Services</p>
                      <p className="text-blue-700">24x7 technical support via phone, email, and web portal. Remote monitoring and diagnostics included.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900">Payment Terms</p>
                      <p className="text-blue-700">Net 30 days from invoice date. Purchase orders and financing options available.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-[#0F2027] mb-4">🚀 Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Immediate Actions:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Review and approve this configuration</li>
                  <li>• Schedule technical consultation call</li>
                  <li>• Finalize delivery timeline and requirements</li>
                  <li>• Submit purchase order or financing application</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Your AE Will Provide:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Detailed implementation planning</li>
                  <li>• Custom configuration optimization</li>
                  <li>• Volume pricing analysis</li>
                  <li>• HPE GreenLake hybrid cloud options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1 bg-[#01A982] hover:bg-[#018f73] text-lg py-4"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-3 h-5 w-5" />
              Download Complete Quote (PDF)
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="flex-1 bg-[#FF8300] hover:bg-[#e67600] text-lg py-4"
              onClick={handleEmailQuote}
            >
              <Mail className="mr-3 h-5 w-5" />
              Email Quote to Customer
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 text-lg py-4 border-2 border-[#01A982] text-[#01A982] hover:bg-[#01A982] hover:text-white"
              onClick={handleScheduleCall}
            >
              <Phone className="mr-3 h-5 w-5" />
              Schedule AE Consultation
            </Button>
          </div>

          {/* Company Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-10 w-auto"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Hewlett Packard Enterprise</p>
                <p className="text-sm text-gray-600">Server & Storage Solutions</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              This quote was generated by HPE's AI-powered sales assistant. 
              All specifications and pricing have been validated by our technical team.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Quote generated on {formatDate(new Date())} • Powered by HPE AI Sales Assistant
            </p>
          </div>
        </div>
      </CardContent>
    </div>
  );
}