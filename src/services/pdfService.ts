import { FormData, PriceBreakdown } from '../components/quote/types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PriceTableRow {
  item: string;
  amount: string;
}

export const generateQuotePDF = (formData: FormData, priceBreakdown: PriceBreakdown, quoteReference: string): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Quote Details', 20, 20);
  doc.setFontSize(12);
  doc.text(`Reference: ${quoteReference}`, 20, 30);

  // Customer Information
  doc.setFontSize(16);
  doc.text('Customer Information', 20, 45);
  doc.setFontSize(12);
  doc.text(`Name: ${formData.contact.name}`, 20, 55);
  doc.text(`Email: ${formData.contact.email}`, 20, 65);
  doc.text(`Phone: ${formData.contact.phone}`, 20, 75);

  // Product Specifications
  doc.setFontSize(16);
  doc.text('Product Specifications', 20, 95);
  doc.setFontSize(12);
  doc.text(`Material: ${formData.material}`, 20, 105);
  doc.text(`Dimensions: ${formData.dimensions.length} x ${formData.dimensions.width} x ${formData.dimensions.height} ${formData.dimensions.unit}`, 20, 115);
  doc.text(`Color: ${formData.color.type}${formData.color.custom ? ` (${formData.color.custom})` : ''}`, 20, 125);
  doc.text(`Quantity: ${formData.quantity}`, 20, 135);

  // Price Breakdown
  doc.setFontSize(16);
  doc.text('Price Breakdown', 20, 155);
  doc.setFontSize(12);

  const priceRows: PriceTableRow[] = [
    { item: 'Base Price', amount: `$${priceBreakdown.base.toFixed(2)}` },
    { item: 'Coating', amount: `$${priceBreakdown.coating.toFixed(2)}` },
    { item: 'Finish', amount: `$${priceBreakdown.finish.toFixed(2)}` },
    { item: 'Volume Adjustment', amount: `$${priceBreakdown.volume.toFixed(2)}` },
    { item: 'Add-ons', amount: `$${priceBreakdown.addons.toFixed(2)}` },
    { item: 'Total', amount: `$${priceBreakdown.total.toFixed(2)}` }
  ];

  autoTable(doc, {
    startY: 165,
    head: [['Item', 'Amount']],
    body: priceRows.map(row => [row.item, row.amount]),
    theme: 'striped',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { halign: 'center' },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 60 }
    }
  });

  // Save the PDF
  doc.save(`quote-${quoteReference}.pdf`);
}; 