import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Lead, AccountExecutive } from '../../types';
import { 
  User, Mail, Phone, Calendar, TrendingUp, Users, DollarSign, Clock, 
  Bell, MessageSquare, Target, Activity, BarChart3, Zap, Video,
  CheckCircle, AlertCircle, ArrowUp, ArrowDown, RefreshCw
} from 'lucide-react';
import accountExecutives from '../../data/accountExecutives.json';

interface Notification {
  id: string;
  type: 'new_lead' | 'quote_approved' | 'meeting_scheduled' | 'ai_insight';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface AIMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export function EnhancedAEDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedAE] = useState<AccountExecutive>(accountExecutives[0] as AccountExecutive);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    conversationsToday: 24,
    quotesGenerated: 18,
    avgResponseTime: 1.2,
    satisfactionScore: 9.1
  });

  const aiMetrics: AIMetric[] = [
    {
      label: 'AI Conversation Success Rate',
      value: '94.2%',
      change: '+5.2%',
      trend: 'up',
      description: 'Conversations that reach quote stage'
    },
    {
      label: 'Quote Conversion Rate', 
      value: '68.5%',
      change: '+12.3%',
      trend: 'up',
      description: 'Quotes that convert to sales'
    },
    {
      label: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      description: 'AI response latency'
    },
    {
      label: 'Customer Satisfaction',
      value: '9.1/10',
      change: '+0.4',
      trend: 'up',
      description: 'AI interaction ratings'
    }
  ];

  useEffect(() => {
    // Simulate some leads
    const mockLeads: Lead[] = [
      {
        id: 'lead-001',
        customer: {
          id: 'cust-001',
          name: 'John Smith',
          company: 'TechCorp Inc',
          email: 'john@techcorp.com',
          requirements: {
            useCase: ['virtualization'],
            workloadType: 'VMware vSphere',
            userCount: 50,
            formFactor: 'rack',
            budgetTier: 'mid',
            performanceNeeds: ['high-memory', 'redundancy']
          },
          createdAt: new Date()
        },
        quote: {
          id: 'quote-001',
          customerId: 'cust-001',
          products: [],
          totalAmount: 8400,
          currency: 'USD',
          status: 'sent',
          createdAt: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          assignedAE: selectedAE
        },
        assignedAE: selectedAE,
        status: 'quoted',
        source: 'LinkedIn Campaign - AI Chat',
        chatHistory: [],
        createdAt: new Date()
      },
      {
        id: 'lead-002',
        customer: {
          id: 'cust-002',
          name: 'Sarah Chen',
          company: 'DataFlow Analytics',
          email: 'sarah@dataflow.com',
          requirements: {
            useCase: ['database', 'ai-ml'],
            workloadType: 'High-Performance Analytics',
            userCount: 200,
            formFactor: 'rack',
            budgetTier: 'enterprise',
            performanceNeeds: ['high-performance', 'gpu-acceleration']
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        quote: {
          id: 'quote-002',
          customerId: 'cust-002',
          products: [],
          totalAmount: 45000,
          currency: 'USD',
          status: 'draft',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          assignedAE: selectedAE
        },
        assignedAE: selectedAE,
        status: 'new',
        source: 'AI Voice Agent',
        chatHistory: [],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];
    setLeads(mockLeads);

    // Simulate notifications
    const mockNotifications: Notification[] = [
      {
        id: 'notif-001',
        type: 'new_lead',
        title: 'New Qualified Lead',
        message: 'Sarah Chen from DataFlow Analytics - AI/ML workloads, $45K budget',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        priority: 'high'
      },
      {
        id: 'notif-002',
        type: 'quote_approved',
        title: 'Quote Approved',
        message: 'John Smith approved HPE ProLiant DL380 Gen11 quote',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        priority: 'high'
      },
      {
        id: 'notif-003',
        type: 'ai_insight',
        title: 'AI Performance Insight',
        message: 'Virtualization inquiries up 40% this week - consider targeted campaign',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        priority: 'medium'
      }
    ];
    setNotifications(mockNotifications);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 15) + 8);
      setRealTimeMetrics(prev => ({
        ...prev,
        conversationsToday: prev.conversationsToday + Math.floor(Math.random() * 2),
        quotesGenerated: prev.quotesGenerated + Math.floor(Math.random() * 2),
        avgResponseTime: Math.max(0.8, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        satisfactionScore: Math.min(10, Math.max(8, prev.satisfactionScore + (Math.random() - 0.5) * 0.3))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedAE]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const stats = [
    { 
      label: 'Active Leads', 
      value: leads.length.toString(), 
      icon: Users, 
      change: '+23%', 
      color: 'text-[#01A982]',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Quotes This Week', 
      value: realTimeMetrics.quotesGenerated.toString(), 
      icon: DollarSign, 
      change: '+15%', 
      color: 'text-[#FF8300]',
      bgColor: 'bg-orange-50'
    },
    { 
      label: 'AI Conversations', 
      value: realTimeMetrics.conversationsToday.toString(), 
      icon: MessageSquare, 
      change: '+34%', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Avg Response Time', 
      value: `${realTimeMetrics.avgResponseTime.toFixed(1)}s`, 
      icon: Clock, 
      change: '-12%', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const handleVideoCall = (leadId: string) => {
    console.log('Starting video call for lead:', leadId);
    // In real implementation, this would trigger video calling interface
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 tour-ae-dashboard">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/Hewlett-Packard-Enterprise-Logo-1.png" 
                alt="HPE Logo" 
                className="h-10 w-auto"
              />
              <img 
                src={selectedAE.avatar}
                alt={selectedAE.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#0F2027]">HPE Sales Dashboard - {selectedAE.name}</h1>
                <p className="text-gray-600">{selectedAE.territory} Territory • {selectedAE.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time Activity Indicator */}
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">{activeUsers} customers online</span>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                
                {showAllNotifications && (
                  <div className="absolute right-0 top-10 w-80 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-[#0F2027]">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.priority === 'high' ? 'bg-red-500' :
                              notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-gray-600">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Button className="bg-[#01A982] hover:bg-[#018f73]">
                New Lead
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#0F2027]">{stat.value}</p>
                    <div className="flex items-center space-x-1">
                      {stat.change.startsWith('+') ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600" />
                      )}
                      <p className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Performance Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0F2027] flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#01A982]" />
                AI Performance Dashboard
              </h2>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiMetrics.map((metric, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#0F2027] mb-1">{metric.value}</div>
                  <div className="text-sm font-medium text-gray-700 mb-2">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Analytics */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-[#0F2027] flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-[#FF8300]" />
                  Lead Pipeline Analytics
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { stage: 'AI Qualification', count: 45, value: '$1.2M', color: 'bg-blue-500' },
                    { stage: 'Quote Generated', count: 23, value: '$890K', color: 'bg-[#FF8300]' },
                    { stage: 'AE Follow-up', count: 12, value: '$645K', color: 'bg-[#01A982]' },
                    { stage: 'Negotiation', count: 8, value: '$425K', color: 'bg-purple-500' },
                    { stage: 'Closed Won', count: 5, value: '$280K', color: 'bg-green-600' }
                  ].map((stage, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div 
                          className={`${stage.color} h-3 rounded-full`}
                          style={{ width: `${(stage.count / 45) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-20 text-sm font-semibold text-right">{stage.count}</div>
                      <div className="w-24 text-sm text-gray-600 text-right">{stage.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-[#0F2027]">Live Activity Feed</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '2m ago', event: 'New chat started', customer: 'Alex Kim - InnovateTech', type: 'chat' },
                    { time: '5m ago', event: 'Quote generated', customer: 'Maria Rodriguez - DataFlow', type: 'quote' },
                    { time: '12m ago', event: 'Voice call completed', customer: 'Robert Chen - Precision Mfg', type: 'call' },
                    { time: '18m ago', event: 'AE assigned', customer: 'Amanda Foster - Regional Medical', type: 'assignment' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'chat' ? 'bg-blue-500' :
                        activity.type === 'quote' ? 'bg-[#FF8300]' :
                        activity.type === 'call' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{activity.event}</p>
                        <p className="text-xs text-gray-600">{activity.customer}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Leads Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#0F2027]">Recent Leads</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leads assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-[#0F2027] text-lg">{lead.customer.name}</h3>
                            <p className="text-gray-600">{lead.customer.company}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lead.status === 'quoted' ? 'bg-orange-100 text-orange-800' :
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MessageSquare className="h-4 w-4" />
                            <span>{lead.source}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{lead.customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{lead.createdAt.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>${lead.quote.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>2.3 min response</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>AI Analysis:</strong> {lead.customer.requirements.workloadType} • 
                            {lead.customer.requirements.userCount} users • {lead.customer.requirements.formFactor} server •
                            Budget tier: {lead.customer.requirements.budgetTier}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {lead.customer.requirements.performanceNeeds.map((need, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVideoCall(lead.id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Video
                        </Button>
                        <Button size="sm" className="bg-[#01A982] hover:bg-[#018f73]">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}