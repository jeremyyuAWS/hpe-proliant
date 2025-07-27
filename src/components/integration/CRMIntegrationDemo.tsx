import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Database, RefreshCw, CheckCircle, ArrowRight, 
  Users, DollarSign, Calendar, FileText, Zap,
  ExternalLink, Monitor, Smartphone
} from 'lucide-react';

interface CRMRecord {
  id: string;
  customerName: string;
  company: string;
  email: string;
  stage: string;
  value: number;
  source: string;
  lastActivity: Date;
  nextAction: string;
  aiInsights: string[];
}

export function CRMIntegrationDemo() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [records, setRecords] = useState<CRMRecord[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);

  const mockCRMData: CRMRecord[] = [
    {
      id: 'sf-001',
      customerName: 'John Smith',
      company: 'TechCorp Inc',
      email: 'john@techcorp.com',
      stage: 'Proposal',
      value: 8400,
      source: 'HPE AI Chat',
      lastActivity: new Date(Date.now() - 10 * 60 * 1000),
      nextAction: 'Schedule technical consultation',
      aiInsights: ['High interest in virtualization', 'Budget approved', 'Decision maker confirmed']
    },
    {
      id: 'sf-002',
      customerName: 'Sarah Chen',
      company: 'DataFlow Analytics',
      email: 'sarah@dataflow.com',
      stage: 'Qualification',
      value: 45000,
      source: 'HPE Voice Agent',
      lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      nextAction: 'Provide GPU acceleration details',
      aiInsights: ['Enterprise budget tier', 'Technical decision maker', 'Urgent timeline (Q1)']
    },
    {
      id: 'sf-003',
      customerName: 'Robert Chen',
      company: 'Precision Manufacturing',
      email: 'robert@precisionmfg.com',
      stage: 'Discovery',
      value: 125000,
      source: 'HPE AI Chat',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextAction: 'Edge computing POC planning',
      aiInsights: ['Complex edge requirements', 'Multi-site deployment', 'Compliance considerations']
    }
  ];

  const handleConnect = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setIsConnected(true);
          setRecords(mockCRMData);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRecords([]);
    setSyncProgress(0);
  };

  const handleRefreshSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      // Simulate new record
      const newRecord: CRMRecord = {
        id: 'sf-new',
        customerName: 'Alex Kim',
        company: 'InnovateTech Startup',
        email: 'alex@innovatetech.io',
        stage: 'New Lead',
        value: 15000,
        source: 'HPE AI Chat',
        lastActivity: new Date(),
        nextAction: 'Initial qualification call',
        aiInsights: ['Startup scaling', 'Cost optimization focus', 'Quick decision timeline']
      };
      setRecords(prev => [newRecord, ...prev]);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F2027] to-[#203A43] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/Hewlett-Packard-Enterprise-Logo-1.png" 
              alt="HPE Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h2 className="text-xl font-semibold">CRM Integration Demo</h2>
              <p className="text-[#01A982] text-sm">Salesforce & HubSpot Connectivity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Connection Stats */}
        {isConnected && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#01A982]">{records.length}</div>
              <div className="text-xs text-gray-300">Synced Records</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#FF8300]">3</div>
              <div className="text-xs text-gray-300">Active Pipelines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">98%</div>
              <div className="text-xs text-gray-300">Sync Success</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">Real-time</div>
              <div className="text-xs text-gray-300">Updates</div>
            </div>
          </div>
        )}
      </div>

      {/* Connection Interface */}
      <div className="p-6">
        {!isConnected ? (
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">CRM Integration Ready</h3>
            <p className="text-gray-500 mb-6">
              Connect to Salesforce or HubSpot to sync AI-generated leads and conversation data
            </p>
            
            {isSyncing ? (
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-[#01A982] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${syncProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Syncing data... {syncProgress}%</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button onClick={handleConnect} className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Salesforce
                  </Button>
                  <Button onClick={handleConnect} className="bg-[#FF8300] hover:bg-[#e67600]">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect HubSpot
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Demo mode - simulated connection</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#0F2027]">Synchronized CRM Records</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleRefreshSync}
                  variant="outline"
                  size="sm"
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Refresh'}
                </Button>
                <Button onClick={handleDisconnect} variant="outline" size="sm">
                  Disconnect
                </Button>
              </div>
            </div>

            {/* CRM Records */}
            <div className="space-y-4">
              {records.map((record, index) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-[#0F2027] text-lg">{record.customerName}</h4>
                            <p className="text-gray-600">{record.company}</p>
                            <p className="text-sm text-gray-500">{record.email}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.stage === 'Proposal' ? 'bg-orange-100 text-orange-800' :
                            record.stage === 'Qualification' ? 'bg-blue-100 text-blue-800' :
                            record.stage === 'Discovery' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {record.stage}
                          </div>
                          {index === 0 && (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              NEW
                            </div>
                          )}
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold">${record.value.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Zap className="h-4 w-4 text-gray-500" />
                            <span>{record.source}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{record.lastActivity.toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span>{record.nextAction}</span>
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="bg-[#01A982]/10 rounded-lg p-4">
                          <h5 className="font-medium text-[#01A982] mb-2 flex items-center">
                            <Zap className="h-4 w-4 mr-1" />
                            AI-Generated Insights
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {record.aiInsights.map((insight, i) => (
                              <span key={i} className="px-3 py-1 bg-[#01A982]/20 text-[#01A982] text-sm rounded-full">
                                {insight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View in CRM
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Integration Benefits */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-bold text-[#0F2027] mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-[#01A982]" />
                  CRM Integration Benefits
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#01A982]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-[#01A982]" />
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">Unified Customer View</div>
                    <div className="text-sm text-gray-600">AI conversations sync with existing CRM records</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#FF8300]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-[#FF8300]" />
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">Automated Lead Scoring</div>
                    <div className="text-sm text-gray-600">AI insights enhance lead qualification</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <ArrowRight className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="font-semibold text-gray-800 mb-1">Seamless Handoff</div>
                    <div className="text-sm text-gray-600">Complete context transfer to sales teams</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}