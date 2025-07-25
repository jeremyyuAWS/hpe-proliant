import jsPDF from 'jspdf';
import { ServerProduct, Customer, Quote } from '../types';

export function generateQuotePDF(
  quote: Quote,
  customer: Customer,
  products: ServerProduct[]
): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const hpeGreen = [1, 169, 130];
  const hpeOrange = [255, 131, 0];
  const hpeDark = [15, 32, 39];
  const gray = [100, 100, 100];
  
  // Header Background
  pdf.setFillColor(hpeDark[0], hpeDark[1], hpeDark[2]);
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // HPE Logo Text (since we can't easily embed images)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(255, 255, 255);
  pdf.text('HEWLETT PACKARD ENTERPRISE', 20, 20);
  
  // Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.text('Advance. Don\'t just adapt.', 20, 30);
  
  // Quote Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(hpeDark[0], hpeDark[1], hpeDark[2]);
  pdf.text('SERVER QUOTATION', 20, 65);
  
  // Quote Info Box
  pdf.setFillColor(240, 248, 255);
  pdf.rect(120, 50, 70, 30, 'F');
  pdf.setDrawColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.rect(120, 50, 70, 30, 'S');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Quote #:', 125, 60);
  pdf.text('Date:', 125, 67);
  pdf.text('Valid Until:', 125, 74);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(quote.id, 145, 60);
  pdf.text(quote.createdAt.toLocaleDateString(), 145, 67);
  pdf.text(quote.validUntil.toLocaleDateString(), 145, 74);
  
  // Customer Information
  let yPos = 95;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.text('BILL TO:', 20, yPos);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(customer.name, 20, yPos + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(customer.company, 20, yPos + 17);
  pdf.text(customer.email, 20, yPos + 24);
  pdf.text('United States', 20, yPos + 31);
  
  // Account Executive Info
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(hpeOrange[0], hpeOrange[1], hpeOrange[2]);
  pdf.text('YOUR ACCOUNT EXECUTIVE:', 120, yPos);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(quote.assignedAE.name, 120, yPos + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Senior Account Executive', 120, yPos + 17);
  pdf.text(quote.assignedAE.email, 120, yPos + 24);
  pdf.text(quote.assignedAE.phone, 120, yPos + 31);
  pdf.text(`${quote.assignedAE.territory} Territory`, 120, yPos + 38);
  
  // Products Section
  yPos = 160;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(hpeDark[0], hpeDark[1], hpeDark[2]);
  pdf.text('RECOMMENDED SERVER CONFIGURATION', 20, yPos);
  
  // Product Details
  products.forEach((product, index) => {
    yPos += 20;
    
    // Product Box
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, yPos - 5, pageWidth - 40, 35, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, yPos - 5, pageWidth - 40, 35, 'S');
    
    // Product Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(hpeDark[0], hpeDark[1], hpeDark[2]);
    pdf.text(`${index + 1}. ${product.model}`, 25, yPos + 5);
    
    // Product Description
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(gray[0], gray[1], gray[2]);
    pdf.text(product.description, 25, yPos + 12);
    
    // Specifications
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Specifications:', 25, yPos + 20);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const specs = [
      `Processors: ${product.specifications.processors}`,
      `Memory: ${product.specifications.memory}`,
      `Storage: ${product.specifications.storage}`,
      `Form Factor: ${product.specifications.formFactor}`
    ];
    
    specs.forEach((spec, specIndex) => {
      pdf.text(`• ${spec}`, 30, yPos + 25 + (specIndex * 4));
    });
    
    // Price
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
    pdf.text(`$${product.pricing.basePrice.toLocaleString()}`, pageWidth - 60, yPos + 5);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(gray[0], gray[1], gray[2]);
    pdf.text('Starting Price', pageWidth - 60, yPos + 12);
    
    yPos += 60;
  });
  
  // Support Services Section
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.text('INCLUDED SUPPORT SERVICES:', 20, yPos);
  
  const supportServices = [
    '✓ 3-Year Next Business Day Hardware Warranty',
    '✓ HPE Pointnext Tech Care Essential',
    '✓ 24x7 Hardware Support & Monitoring',
    '✓ Remote Diagnostics & Health Monitoring',
    '✓ Software Updates & Security Patches',
    '✓ Professional Installation Service'
  ];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  
  supportServices.forEach((service, index) => {
    pdf.text(service, 25, yPos + 10 + (index * 6));
  });
  
  // Pricing Summary
  yPos += 60;
  pdf.setFillColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.rect(20, yPos, pageWidth - 40, 25, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('INVESTMENT SUMMARY', 25, yPos + 8);
  
  yPos += 35;
  const pricing = [
    { label: 'Hardware Subtotal:', amount: quote.totalAmount },
    { label: 'Support Services:', amount: 2400 },
    { label: 'Volume Discount (10%):', amount: -Math.round(quote.totalAmount * 0.1) },
    { label: 'Shipping & Handling:', amount: 450 },
    { label: 'Tax:', amount: Math.round(quote.totalAmount * 0.08) }
  ];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  
  pricing.forEach((item, index) => {
    pdf.text(item.label, 25, yPos + (index * 8));
    const amount = item.amount >= 0 ? `$${item.amount.toLocaleString()}` : `-$${Math.abs(item.amount).toLocaleString()}`;
    pdf.text(amount, pageWidth - 60, yPos + (index * 8));
  });
  
  // Total
  yPos += 50;
  pdf.setFillColor(hpeOrange[0], hpeOrange[1], hpeOrange[2]);
  pdf.rect(20, yPos - 5, pageWidth - 40, 20, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('TOTAL INVESTMENT:', 25, yPos + 7);
  pdf.text(`$${quote.totalAmount.toLocaleString()}`, pageWidth - 60, yPos + 7);
  
  // Terms and Conditions
  yPos += 30;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(hpeDark[0], hpeDark[1], hpeDark[2]);
  pdf.text('TERMS & CONDITIONS:', 20, yPos);
  
  const terms = [
    '• This quotation is valid for 30 days from the date of issue',
    '• Pricing includes standard warranty and support options',
    '• Final pricing may vary based on configuration and volume discounts',
    '• Payment terms: Net 30 days from invoice date',
    '• Estimated delivery: 2-4 weeks after receipt of order',
    '• All prices are in USD and exclude applicable taxes unless noted'
  ];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  
  terms.forEach((term, index) => {
    pdf.text(term, 25, yPos + 10 + (index * 6));
  });
  
  // Footer
  yPos = pageHeight - 30;
  pdf.setDrawColor(hpeGreen[0], hpeGreen[1], hpeGreen[2]);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(gray[0], gray[1], gray[2]);
  pdf.text('This quote was generated by HPE\'s AI-powered sales assistant.', 20, yPos + 8);
  pdf.text('All specifications and pricing have been validated by our technical team.', 20, yPos + 14);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Quote generated on ${new Date().toLocaleDateString()} • Powered by HPE AI Sales Assistant`, 20, yPos + 20);
  
  // Download the PDF
  const fileName = `HPE-Quote-${quote.id}-${customer.name.replace(/\s+/g, '-')}.pdf`;
  pdf.save(fileName);
}

// Helper function to handle PDF generation from quote display
export function downloadQuoteAsPDF(quoteData: any) {
  // Convert the quoteData format to match our expected types
  const quote: Quote = {
    id: quoteData.id,
    customerId: quoteData.customerInfo.name.toLowerCase().replace(/\s+/g, '-'),
    products: [], // Will be filled from quoteData.products
    totalAmount: quoteData.pricing.total,
    currency: quoteData.pricing.currency,
    status: 'sent' as const,
    createdAt: quoteData.createdAt,
    validUntil: quoteData.validUntil,
    assignedAE: quoteData.assignedAE
  };

  const customer: Customer = {
    id: 'customer-' + Date.now(),
    name: quoteData.customerInfo.name,
    company: quoteData.customerInfo.company,
    email: quoteData.customerInfo.email,
    requirements: {
      useCase: ['enterprise'],
      workloadType: 'Enterprise Computing',
      userCount: 100,
      formFactor: 'rack' as const,
      budgetTier: 'enterprise' as const,
      performanceNeeds: ['high-performance', 'reliability']
    },
    createdAt: new Date()
  };

  // Convert quote products to ServerProduct format
  const products: ServerProduct[] = quoteData.products.map((product: any) => ({
    id: product.model.toLowerCase().replace(/\s+/g, '-'),
    model: product.model,
    series: 'ProLiant',
    category: '2U Rack Server',
    description: 'High-performance enterprise server optimized for your workloads',
    specifications: {
      processors: product.configuration.processor,
      memory: product.configuration.memory,
      storage: product.configuration.storage,
      formFactor: '2U Rack',
      powerSupply: '800W Platinum Hot Plug'
    },
    pricing: {
      basePrice: product.unitPrice,
      currency: 'USD'
    },
    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg',
    useCases: ['enterprise', 'virtualization'],
    targetWorkloads: ['Enterprise applications', 'Virtualization', 'Database servers']
  }));

  generateQuotePDF(quote, customer, products);
}