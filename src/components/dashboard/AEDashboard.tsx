import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Lead, AccountExecutive } from '../../types';
import { User, Mail, Phone, Calendar, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import accountExecutives from '../../data/accountExecutives.json';

export function AEDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedAE] = useState<AccountExecutive>(accountExecutives[0] as AccountExecutive);

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
        source: 'LinkedIn Campaign',
        chatHistory: [],
        createdAt: new Date()
      }
    ];
    setLeads(mockLeads);
  }, [selectedAE]);

  const stats = [
    { label: 'Active Leads', value: '12', icon: Users, change: '+23%', color: 'text-[#01A982]' },
    { label: 'Quotes Sent', value: '8', icon: DollarSign, change: '+15%', color: 'text-[#FF8300]' },
    { label: 'This Month Revenue', value: '$125K', icon: TrendingUp, change: '+34%', color: 'text-green-600' },
    { label: 'Avg Response Time', value: '2.3h', icon: Clock, change: '-12%', color: 'text-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <Button className="bg-[#01A982] hover:bg-[#018f73]">
              New Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-[#0F2027]">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100`}>
                    <stat.icon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-[#0F2027]">Recent Leads</h2>
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
                  <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-[#0F2027]">{lead.customer.name}</h3>
                            <p className="text-sm text-gray-600">{lead.customer.company}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'quoted' ? 'bg-orange-100 text-orange-800' :
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
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
                            <TrendingUp className="h-4 w-4" />
                            <span>{lead.source}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-700">
                            <strong>Requirements:</strong> {lead.customer.requirements.workloadType} • 
                            {lead.customer.requirements.userCount} users • {lead.customer.requirements.formFactor} server
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" className="bg-[#01A982] hover:bg-[#018f73]">
                          View Details
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