import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Mail, Phone, Download, Share, User, Calendar, DollarSign, Server, Shield, Clock, Check, Award, Truck, HeadphonesIcon, Globe, CreditCard, Building, MapPin, Zap, ChevronRight, Star, Target, TrendingUp } from 'lucide-react';
import { downloadQuoteAsPDF } from '../../utils/pdfGenerator';

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
    downloadQuoteAsPDF(quoteData);
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
    <div className="max-w-6xl mx-auto bg-white">
      {/* Enhanced Professional Header */}
      <CardHeader className="bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-8">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-14 w-auto"
              />
              <div className="border-l border-white/30 pl-8">
                <h1 className="text-4xl font-bold mb-2">Server Quotation</h1>
                <div className="flex items-center space-x-4">
                  <div className="bg-[#01A982] px-4 py-2 rounded-full">
                    <p className="text-white font-bold text-lg">#{quoteData.id}</p>
                  </div>
                  <div className="text-sm opacity-90">
                    <p>Hewlett Packard Enterprise</p>
                    <p className="text-[#01A982] font-semibold">Enterprise Server Solutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="space-y-3">
                <div>
                  <p className="text-sm opacity-80 mb-1">Quote Date</p>
                  <p className="font-bold text-xl">{formatDate(quoteData.createdAt)}</p>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-sm opacity-80 mb-1">Valid Until</p>
                  <p className="font-semibold text-lg text-[#FF8300]">{formatDate(quoteData.validUntil)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Company Tagline */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <p className="text-2xl font-bold text-[#01A982] mb-2">
              "Advance. Don't just adapt."
            </p>
            <p className="text-sm opacity-80">Leading the transformation to a hybrid, everything-as-a-service model</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Enhanced Quote Summary Dashboard */}
        <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 border-b">
          <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-6">
            <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#01A982] to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#01A982] mb-1">${quoteData.pricing.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Total Investment</div>
              <div className="text-xs text-gray-500 mt-1">All-inclusive pricing</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF8300] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#FF8300] mb-1">{quoteData.products.reduce((sum, p) => sum + p.quantity, 0)}</div>
              <div className="text-sm text-gray-600 font-medium">Server Units</div>
              <div className="text-xs text-gray-500 mt-1">High-performance</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">2-4</div>
              <div className="text-sm text-gray-600 font-medium">Weeks Delivery</div>
              <div className="text-xs text-gray-500 mt-1">Express available</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">3</div>
              <div className="text-sm text-gray-600 font-medium">Years Warranty</div>
              <div className="text-xs text-gray-500 mt-1">NBD support</div>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">10%</div>
              <div className="text-sm text-gray-600 font-medium">Volume Savings</div>
              <div className="text-xs text-gray-500 mt-1">Enterprise discount</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Enhanced Customer & Sales Rep Information */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F2027]">Bill To</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-bold text-xl text-gray-800">{quoteData.customerInfo.name}</div>
                      <div className="text-gray-600 font-medium">{quoteData.customerInfo.company}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{quoteData.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">United States</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">North America Region</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#01A982]/5 to-green-50 rounded-2xl p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF8300] to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F2027]">Your HPE Account Executive</h3>
              </div>
              <div className="bg-white rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#01A982] to-green-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-800">{quoteData.assignedAE.name}</div>
                    <div className="text-gray-600 font-medium">Senior Account Executive</div>
                    <div className="text-sm text-[#01A982] font-medium">{quoteData.assignedAE.territory} Territory</div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{quoteData.assignedAE.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">{quoteData.assignedAE.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Available 8 AM - 6 PM PST</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleScheduleCall} className="flex-1">
                    <Phone className="mr-1 h-3 w-3" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="mr-1 h-3 w-3" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Configuration Details */}
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#01A982] to-green-600 rounded-xl flex items-center justify-center mr-4">
                <Server className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0F2027]">HPE ProLiant Server Configuration</h3>
                <p className="text-gray-600 mt-1">Enterprise-grade servers optimized for your workloads</p>
              </div>
            </div>
            
            {quoteData.products.map((product, index) => (
              <div key={index} className="border rounded-2xl p-8 mb-8 bg-gradient-to-br from-white to-gray-50 shadow-lg border-gray-200">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=300"
                        alt={product.model}
                        className="w-28 h-22 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 bg-[#01A982] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {product.quantity}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-[#0F2027] mb-2">{product.model}</h4>
                      <p className="text-gray-600 font-medium text-lg mb-3">High-Performance 2U Rack Server</p>
                      <div className="flex items-center space-x-4">
                        <span className="bg-gradient-to-r from-[#01A982] to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          Quantity: {product.quantity}
                        </span>
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          2U Rack Mount
                        </span>
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                          <Star className="w-3 h-3 mr-1 inline" />
                          Enterprise Class
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right bg-gradient-to-br from-[#01A982]/10 to-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="text-4xl font-bold text-[#01A982] mb-2">
                      ${product.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-gray-600 font-medium">
                      ${product.unitPrice.toLocaleString()} per unit
                    </div>
                    <div className="text-sm text-gray-500 mt-2 flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      Configuration Total
                    </div>
                  </div>
                </div>

                {/* Enhanced Technical Specifications Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#01A982] to-green-600 rounded-lg flex items-center justify-center mr-3">
                        <Server className="h-5 w-5 text-white" />
                      </div>
                      <h5 className="font-bold text-xl text-gray-800">Core Specifications</h5>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Processors', value: product.configuration.processor, icon: Zap },
                        { label: 'Memory', value: product.configuration.memory, icon: Zap },
                        { label: 'Storage', value: product.configuration.storage, icon: Zap },
                        { label: 'Network', value: product.configuration.network, icon: Zap },
                        { label: 'Form Factor', value: '2U Rack Mount', icon: Zap }
                      ].map((spec, i) => (
                        <div key={i} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-2">
                            <spec.icon className="h-4 w-4 text-[#01A982]" />
                            <span className="text-gray-600 font-medium">{spec.label}:</span>
                          </div>
                          <span className="text-right text-gray-800 max-w-xs font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF8300] to-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <h5 className="font-bold text-xl text-gray-800">Support & Services Included</h5>
                    </div>
                    <div className="space-y-3">
                      {[
                        { icon: Check, text: product.configuration.warranty, color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "HPE Pointnext Tech Care Essential", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "24x7 Hardware Support & Monitoring", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "Remote Diagnostics & Health Monitoring", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "Software Updates & Security Patches", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "HPE MySupport Portal Access", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "Professional Installation Service", color: "text-green-600", bg: "bg-green-50" },
                        { icon: Check, text: "Configuration Backup & Recovery", color: "text-green-600", bg: "bg-green-50" }
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center space-x-3 p-3 rounded-lg ${item.bg}`}>
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                          <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Configuration Notes */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <h6 className="font-bold text-blue-900 text-lg">Configuration Highlights</h6>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        <span>HPE iLO 6 Standard for remote management</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        <span>RAID 1+0 configuration for optimal performance</span>
                      </li>
                    </ul>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        <span>SR-IOV enabled for virtualization optimization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                        <span>Energy Star certified for efficiency</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Comprehensive Pricing Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 mb-12 border border-gray-200">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#01A982] to-green-600 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#0F2027]">Investment Summary</h3>
                <p className="text-gray-600 mt-1">Comprehensive pricing breakdown with enterprise benefits</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 font-semibold text-lg">Hardware Subtotal:</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-800">${quoteData.pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="text-green-600 font-semibold text-lg">Volume Discount (10%):</span>
                      <p className="text-sm text-gray-500">Enterprise pricing benefit</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">-${quoteData.pricing.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <HeadphonesIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-gray-700 font-semibold text-lg">HPE Pointnext Services:</span>
                      <p className="text-sm text-gray-500">3-year tech care essential package</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">$2,400</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-orange-600" />
                    <div>
                      <span className="text-gray-700 font-semibold text-lg">Shipping & Handling:</span>
                      <p className="text-sm text-gray-500">White glove delivery service</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">$450</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 font-semibold text-lg">Tax & Fees:</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-700">${quoteData.pricing.tax.toLocaleString()}</span>
                </div>
                
                <div className="bg-gradient-to-r from-[#01A982]/10 via-green-50 to-[#FF8300]/10 rounded-2xl p-6 mt-8 border-2 border-[#01A982]/20">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#01A982] to-green-600 rounded-full flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <span className="text-3xl font-bold text-[#0F2027]">Total Investment:</span>
                        <p className="text-gray-600 font-medium">Complete enterprise solution</p>    
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-bold text-[#01A982]">
                        ${quoteData.pricing.total.toLocaleString()}
                      </span>
                      <p className="text-xl text-gray-600 font-medium">{quoteData.pricing.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Payment Terms Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#01A982] to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-lg text-gray-800 mb-2">Payment Terms</div>
                <div className="text-gray-600 font-medium">Net 30 Days</div>
                <div className="text-sm text-gray-500 mt-2">Purchase orders accepted</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF8300] to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-lg text-gray-800 mb-2">Delivery</div>
                <div className="text-gray-600 font-medium">2-4 Weeks ARO</div>
                <div className="text-sm text-gray-500 mt-2">Express shipping available</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="font-bold text-lg text-gray-800 mb-2">Warranty</div>
                <div className="text-gray-600 font-medium">3 Years NBD</div>
                <div className="text-sm text-gray-500 mt-2">24x7 support included</div>
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