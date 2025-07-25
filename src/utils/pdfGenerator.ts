import jsPDF from 'jspdf';
import { ServerProduct, Customer, Quote } from '../types';

export function generateQuotePDF(
  quote: Quote,
  customer: Customer,
  products: ServerProduct[]
): void {
  const pdf = new jsPDF();
  
  // Add HPE logo (we'll simulate this with text for now since we can't load images in jsPDF easily)
  pdf.setFontSize(16);
  pdf.setTextColor(1, 169, 130); // HPE Green
  pdf.text('HEWLETT PACKARD ENTERPRISE', 20, 20);
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(15, 32, 39); // HPE Dark color
  pdf.text('HPE ProLiant Server Quotation', 20, 35);
  
  // Tagline
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Advance. Don\'t just adapt.', 20, 45);
  
  // Quote details
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Quote ID: ${quote.id}`, 20, 65);
  pdf.text(`Date: ${quote.createdAt.toLocaleDateString()}`, 20, 75);
  pdf.text(`Valid Until: ${quote.validUntil.toLocaleDateString()}`, 20, 85);
  
  // Customer information
  pdf.setFontSize(14);
  pdf.setTextColor(1, 169, 130);
  pdf.text('Customer Information:', 20, 105);
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${customer.name}`, 25, 120);
  pdf.text(`Company: ${customer.company}`, 25, 130);
  pdf.text(`Email: ${customer.email}`, 25, 140);
  
  // Products
  pdf.setFontSize(14);
  pdf.setTextColor(1, 169, 130);
  pdf.text('Recommended Server Configuration:', 20, 160);
  
  let yPosition = 175;
  products.forEach((product, index) => {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${product.model}`, 25, yPosition);
    pdf.setFontSize(10);
    pdf.text(`   ${product.description}`, 25, yPosition + 10);
    pdf.text(`   Category: ${product.category}`, 25, yPosition + 20);
    pdf.text(`   Starting Price: $${product.pricing.basePrice.toLocaleString()}`, 25, yPosition + 30);
    yPosition += 45;
  });
  
  // Total
  pdf.setFontSize(14);
  pdf.setTextColor(255, 131, 0); // HPE Orange
  pdf.text(`Total Estimated Investment: $${quote.totalAmount.toLocaleString()}`, 20, yPosition + 20);
  
  // Terms and footer
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Terms & Conditions:', 20, yPosition + 40);
  pdf.text('• This quote is valid for 30 days from the date of issue.', 25, yPosition + 50);
  pdf.text('• Pricing includes standard warranty and support options.', 25, yPosition + 60);
  pdf.text('• Final pricing may vary based on configuration and volume discounts.', 25, yPosition + 70);
  
  // Account Executive info
  pdf.setFontSize(12);
  pdf.setTextColor(1, 169, 130);
  pdf.text('Your HPE Account Executive:', 20, yPosition + 90);
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`${quote.assignedAE.name}`, 25, yPosition + 105);
  pdf.text(`${quote.assignedAE.email}`, 25, yPosition + 115);
  pdf.text(`${quote.assignedAE.phone}`, 25, yPosition + 125);
  
  // Download the PDF
  pdf.save(`HPE-Quote-${quote.id}.pdf`);
}