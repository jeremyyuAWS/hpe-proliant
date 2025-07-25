export const HPE_COLORS = {
  primary: '#01A982',
  secondary: '#FF8300', 
  dark: '#0F2027',
  light: '#F8F9FA',
  gray: '#6C757D',
  white: '#FFFFFF'
} as const;

export const CHAT_PHASES = {
  GREETING: 'greeting',
  LEAD_CAPTURE: 'lead_capture', 
  REQUIREMENTS: 'requirements',
  RECOMMENDATION: 'recommendation',
  QUOTATION: 'quotation',
  COMPLETED: 'completed'
} as const;

export const USE_CASES = [
  { id: 'virtualization', label: 'Virtualization', description: 'VMware, Hyper-V, KVM environments' },
  { id: 'database', label: 'Database', description: 'SQL Server, Oracle, MySQL workloads' },
  { id: 'web', label: 'Web Applications', description: 'Web servers, application hosting' },
  { id: 'ai-ml', label: 'AI/ML', description: 'Machine learning, data analytics' },
  { id: 'enterprise', label: 'Enterprise Apps', description: 'ERP, CRM, business applications' },
  { id: 'file-storage', label: 'File & Storage', description: 'File servers, NAS, backup' },
  { id: 'small-business', label: 'Small Business', description: 'General purpose, office applications' }
] as const;

export const WORKLOAD_TYPES = [
  'General Purpose Computing',
  'High-Performance Computing', 
  'Database & Analytics',
  'Virtualization',
  'Web & Application Hosting',
  'File & Print Services',
  'AI & Machine Learning'
] as const;

export const FORM_FACTORS = [
  { id: 'rack', label: 'Rack Mount', description: 'Data center deployment' },
  { id: 'tower', label: 'Tower', description: 'Office or small server room' },
  { id: 'blade', label: 'Blade', description: 'High-density environments' }
] as const;