export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  requirements: CustomerRequirements;
  createdAt: Date;
}

export interface CustomerRequirements {
  useCase: string[];
  workloadType: string;
  userCount: number;
  formFactor: 'rack' | 'tower' | 'blade';
  budgetTier: 'entry' | 'mid' | 'enterprise';
  performanceNeeds: string[];
}

export interface ServerProduct {
  id: string;
  model: string;
  series: string;
  category: string;
  description: string;
  specifications: {
    processors: string;
    memory: string;
    storage: string;
    formFactor: string;
    powerSupply: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  imageUrl: string;
  useCases: string[];
  targetWorkloads: string[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'recommendation' | 'quote';
  data?: any;
}

export interface AccountExecutive {
  id: string;
  name: string;
  email: string;
  territory: string;
  phone: string;
  avatar: string;
}

export interface Quote {
  id: string;
  customerId: string;
  products: ServerProduct[];
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'approved' | 'declined';
  createdAt: Date;
  validUntil: Date;
  assignedAE: AccountExecutive;
}

export interface Lead {
  id: string;
  customer: Customer;
  quote: Quote;
  assignedAE: AccountExecutive;
  status: 'new' | 'qualified' | 'quoted' | 'converted';
  source: string;
  chatHistory: ChatMessage[];
  createdAt: Date;
}