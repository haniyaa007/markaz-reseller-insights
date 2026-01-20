import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { SheetData, BasicsData, TopProduct } from './googlesheet';

interface ExportData {
  sheetData: SheetData;
  currentPeriodData: BasicsData;
  dateRangeLabel: string;
  deliveryDataPartners: Array<{ name: string; percentage: number }>;
  deliveryDataCities: Array<{ name: string; percentage: number }>;
  filteredProducts: TopProduct[];
}

export const generateAnalyticsPDF = (data: ExportData) => {
  const { sheetData, currentPeriodData, dateRangeLabel, deliveryDataPartners, deliveryDataCities, filteredProducts } = data;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;
  
  // Colors - Markaz Brand (#02BC87, #070A56)
  const primaryColor: [number, number, number] = [2, 188, 135]; // #02BC87
  const textDark: [number, number, number] = [7, 10, 86]; // #070A56
  const textMuted: [number, number, number] = [87, 122, 112]; // #577A70
  const successColor: [number, number, number] = [2, 188, 135]; // #02BC87
  
  // Helper functions
  const addSectionHeader = (text: string) => {
    yPos += 8;
    doc.setFontSize(12);
    doc.setTextColor(...textDark);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, yPos);
    yPos += 10;
  };
  
  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
  };
  
  // Header Section
  doc.setFillColor(2, 188, 135); // #02BC87
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Markaz Analytics Report', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${dateRangeLabel} | Generated: ${new Date().toLocaleDateString('en-PK')}`, margin, 35);
  
  yPos = 60;
  
  // Key Metrics Section
  addSectionHeader('Key Performance Metrics');
  
  const metricsData = [
    ['Metric', 'Value'],
    ['Total Sales', formatCurrency(currentPeriodData.avg_revenue)],
    ['Profit', formatCurrency(currentPeriodData.avg_profit)],
    ['Total Orders', Math.round(currentPeriodData.avg_orders).toString()],
    ['Customers', Math.round(currentPeriodData.avg_customers).toString()],
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: textDark,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { halign: 'right', cellWidth: 60 },
    },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Delivery Performance - Partners
  if (deliveryDataPartners && deliveryDataPartners.length > 0) {
    addSectionHeader('Delivery Performance by Partners');
    
    const partnerData = [
      ['Partner', 'Success Rate'],
      ...deliveryDataPartners.map(p => [p.name, `${Math.round(p.percentage)}%`])
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [partnerData[0]],
      body: partnerData.slice(1),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: successColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: textDark,
      },
      alternateRowStyles: {
        fillColor: [240, 253, 244],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right', cellWidth: 50 },
      },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Delivery Performance - Cities
  if (deliveryDataCities && deliveryDataCities.length > 0) {
    addSectionHeader('Delivery Performance by Cities');
    
    const cityData = [
      ['City', 'Success Rate'],
      ...deliveryDataCities.map(c => [c.name, `${Math.round(c.percentage)}%`])
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [cityData[0]],
      body: cityData.slice(1),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: textDark,
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right', cellWidth: 50 },
      },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Check if we need a new page
  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  
  // Top Products Section
  addSectionHeader('Top Products');
  
  const productTableData = [
    ['Product', 'Category', 'Orders', 'Delivery Success'],
    ...filteredProducts.slice(0, 10).map(p => [
      p.Product,
      p.Category,
      p.TotalOrders.toLocaleString(),
      `${Math.round(p.DeliveryPercentage)}%`
    ])
  ];
  
  autoTable(doc, {
    startY: yPos,
    head: [productTableData[0]],
    body: productTableData.slice(1),
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [84, 148, 113], // #549471
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: textDark,
    },
    alternateRowStyles: {
      fillColor: [240, 253, 244],
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35 },
      2: { halign: 'right', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 30 },
    },
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page for profit bands
  if (yPos > 180) {
    doc.addPage();
    yPos = 20;
  }
  
  // Profit Bands Analysis
  if (sheetData.profitBand && sheetData.profitBand.length > 0) {
    addSectionHeader('Profit Bands Analysis (Per Order)');
    
    const profitBandData = [
      ['Profit Band', 'Reseller Pay', 'Money Earned', 'Potential Earnings', 'Delivered'],
      ...sheetData.profitBand.map(band => [
        band.profit_band,
        formatCurrency(band.reseller_pay_30d),
        formatCurrency(band.money_earned_30d),
        formatCurrency(band.potential_earnings_30d),
        band.delivered_30d.toLocaleString()
      ])
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [profitBandData[0]],
      body: profitBandData.slice(1),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [168, 85, 247],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textDark,
      },
      alternateRowStyles: {
        fillColor: [250, 245, 255],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 25 },
        1: { halign: 'right', cellWidth: 35 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'right', cellWidth: 40 },
        4: { halign: 'right', cellWidth: 30 },
      },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Monthly Revenue Trends
  if (sheetData.orderRevenueChart && sheetData.orderRevenueChart.length > 0) {
    if (yPos > 180) {
      doc.addPage();
      yPos = 20;
    }
    
    addSectionHeader('Monthly Sales & Orders Trend');
    
    const revenueData = [
      ['Month', 'Total Orders', 'Total Revenue'],
      ...sheetData.orderRevenueChart.map(item => [
        item.month_name,
        item.total_orders.toLocaleString(),
        formatCurrency(item.total_revenue)
      ])
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [revenueData[0]],
      body: revenueData.slice(1),
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [6, 182, 212],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: textDark,
      },
      alternateRowStyles: {
        fillColor: [236, 254, 255],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { halign: 'right', cellWidth: 40 },
        2: { halign: 'right', cellWidth: 50 },
      },
    });
  }
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text(
      `Page ${i} of ${pageCount} | Markaz Reseller Analytics`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `Markaz_Analytics_${dateRangeLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
