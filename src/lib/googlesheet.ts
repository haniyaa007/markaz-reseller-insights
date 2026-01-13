// src/lib/googlesheet.ts

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxQvMRJB4sXof1qdKWQPRhXwsZcStC0WJ5HKILlHa2NyCxhjGs5QVJ5C7OYcjmtqfg/exec';

// Basics sheet data interface
export interface BasicsData {
  total_revenue: number;
  total_profit: number;
  total_orders: number;
  pending_inprogress_orders: number;
  customers: number;
}

// Order vs Revenue Chart data interface
export interface OrderRevenueData {
  period: string;
  revenue: number;
  orders: number;
  profit: number;
}

// Delivery Performance by Courier interface
export interface DeliveryPerformanceCourier {
  partner_name: string;
  delivered_orders: number;
  total_orders: number;
  success_rate: number;
}

// Delivery Performance by City interface
export interface DeliveryPerformanceCity {
  city_name: string;
  delivered_orders: number;
  total_orders: number;
  success_rate: number;
}

// Profit Band data interface
export interface ProfitBand {
  band_name: string;
  min_profit: number;
  max_profit: number;
  product_count: number;
  total_profit: number;
  percentage: number;
}

// Top Products data interface
export interface TopProduct {
  Period: string;
  Category: string;
  Subcategory: string;
  ProductCode: string;
  Product: string;
  TotalOrders: number;
  DeliveredOrders: number;
  DeliveryPercentile: number;
}

// Main sheet data interface
export interface SheetData {
  basics: BasicsData;
  orderRevenueChart: OrderRevenueData[];
  deliveryPerformanceCourier: DeliveryPerformanceCourier[];
  deliveryPerformanceCity: DeliveryPerformanceCity[];
  profitBand: ProfitBand[];
  topProducts: TopProduct[];
}

// Map period names from UI to Google Sheets format
const periodMapping: Record<string, string> = {
  "7_DAYS": "Last 7 Days",
  "30_DAYS": "Last 30 Days",
  "3_MONTHS": "Last 3 Months",
  "6_MONTHS": "Last 6 Months",
  "1_YEAR": "Last 1 Year",
  "ALL_TIME": "All Time"
};

// Fetch data from specific sheet with optional period parameter
async function fetchFromSheet(sheetName: string, period?: string): Promise<any> {
  try {
    let url = `${GOOGLE_SHEET_URL}?sheet=${sheetName}`;
    if (period) {
      url += `&period=${period}`;
    }
    
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url);
    const result = await response.json();
    
    console.log(`Response from ${sheetName}:`, result);
    
    if (result.success) {
      return result[sheetName] || result.data || null;
    }
    
    throw new Error(`Failed to fetch data from ${sheetName} sheet`);
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    return null;
  }
}

// Helper function to find data for specific period
function findPeriodData(dataArray: any[], period: string): any {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return null;
  }
  
  // Map the period to the format used in Google Sheets
  const mappedPeriod = periodMapping[period] || period;
  
  // Find the matching period in the array
  const periodData = dataArray.find(item => 
    item.time_period === mappedPeriod || 
    item.Period === period ||
    item.period === period
  );
  
  console.log(`Looking for period: ${mappedPeriod}, found:`, periodData);
  
  return periodData || dataArray[0]; // Fallback to first item if period not found
}

// Convert API basics data to expected format
function convertBasicsData(apiData: any): BasicsData {
  if (!apiData) {
    return getDefaultBasicsData();
  }
  
  return {
    total_revenue: Number(apiData.avg_revenue || apiData.total_revenue || 0),
    total_profit: Number(apiData.avg_profit || apiData.total_profit || 0),
    total_orders: Number(apiData.avg_orders || apiData.total_orders || 0),
    pending_inprogress_orders: Number(apiData.pending_orders || apiData.pending_inprogress_orders || 0),
    customers: Number(apiData.avg_customers || apiData.customers || 0)
  };
}

// Convert API order revenue data to expected format
function convertOrderRevenueData(apiData: any[]): OrderRevenueData[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    period: item.period || item.time_period || item.month || item.month_name || '',
    revenue: Number(item.revenue || item.total_revenue || item.avg_revenue || 0),
    orders: Number(item.orders || item.total_orders || item.avg_orders || 0),
    profit: Number(item.profit || item.total_profit || item.avg_profit || 0)
  }));
}

// Convert delivery performance courier data
function convertDeliveryPerformanceCourier(apiData: any[]): DeliveryPerformanceCourier[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    partner_name: item.partner_name || item.partner || item.name || '',
    delivered_orders: Number(item.delivered_orders || item.successful_deliveries || 0),
    total_orders: Number(item.total_orders || item.total || 0),
    success_rate: Number(item.success_rate || item.percentage || 0)
  }));
}

// Convert delivery performance city data
function convertDeliveryPerformanceCity(apiData: any[]): DeliveryPerformanceCity[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    city_name: item.city_name || item.city || item.name || '',
    delivered_orders: Number(item.delivered_orders || item.successful_deliveries || 0),
    total_orders: Number(item.total_orders || item.total || 0),
    success_rate: Number(item.success_rate || item.percentage || 0)
  }));
}

// Convert profit band data
function convertProfitBand(apiData: any[]): ProfitBand[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    band_name: item.band_name || item.name || '',
    min_profit: Number(item.min_profit || 0),
    max_profit: Number(item.max_profit || 0),
    product_count: Number(item.product_count || item.count || 0),
    total_profit: Number(item.total_profit || item.profit || 0),
    percentage: Number(item.percentage || 0)
  }));
}

// Convert top products data
function convertTopProducts(apiData: any[]): TopProduct[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    Period: item.Period || item.period || item.time_period || '',
    Category: item.Category || item.category || '',
    Subcategory: item.Subcategory || item.subcategory || item.sub_category || '',
    ProductCode: item.ProductCode || item.product_code || item.code || '',
    Product: item.Product || item.product || item.name || '',
    TotalOrders: Number(item.TotalOrders || item.total_orders || 0),
    DeliveredOrders: Number(item.DeliveredOrders || item.delivered_orders || 0),
    DeliveryPercentile: Number(item.DeliveryPercentile || item.delivery_percentile || item.delivery_percentage || 0)
  }));
}

// Main function to fetch all sheet data
export async function fetchSheetData(): Promise<SheetData> {
  try {
    const [basicsRaw, orderRevenueRaw, deliveryCourierRaw, deliveryCityRaw, profitBandRaw, topProductsRaw] = await Promise.all([
      fetchFromSheet('basics'),
      fetchFromSheet('ordervsrevenuechart'),
      fetchFromSheet('deliveryperformancecourier'),
      fetchFromSheet('deliveryperformancecity'),
      fetchFromSheet('profitband'),
      fetchFromSheet('topproducts')
    ]);

    console.log('Raw data received:', {
      basics: basicsRaw,
      orderRevenue: orderRevenueRaw,
      deliveryCourier: deliveryCourierRaw,
      deliveryCity: deliveryCityRaw,
      profitBand: profitBandRaw,
      topProducts: topProductsRaw
    });

    // Convert and return data
    return {
      basics: convertBasicsData(Array.isArray(basicsRaw) ? basicsRaw[0] : basicsRaw),
      orderRevenueChart: convertOrderRevenueData(orderRevenueRaw),
      deliveryPerformanceCourier: convertDeliveryPerformanceCourier(deliveryCourierRaw),
      deliveryPerformanceCity: convertDeliveryPerformanceCity(deliveryCityRaw),
      profitBand: convertProfitBand(profitBandRaw),
      topProducts: convertTopProducts(topProductsRaw)
    };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return getDefaultSheetData();
  }
}

// Fetch data for specific time period
export async function fetchSheetDataByPeriod(period: string): Promise<SheetData> {
  try {
    console.log(`Fetching data for period: ${period}`);
    
    const [basicsRaw, orderRevenueRaw, deliveryCourierRaw, deliveryCityRaw, profitBandRaw, topProductsRaw] = await Promise.all([
      fetchFromSheet('basics'),
      fetchFromSheet('ordervsrevenuechart'),
      fetchFromSheet('deliveryperformancecourier'),
      fetchFromSheet('deliveryperformancecity'),
      fetchFromSheet('profitband'),
      fetchFromSheet('topproducts')
    ]);

    console.log('Raw data for period:', {
      basics: basicsRaw,
      orderRevenue: orderRevenueRaw
    });

    // Find the data for the specific period
    const periodBasics = findPeriodData(basicsRaw, period);
    
    // Filter order revenue chart for the period
    const filteredOrderRevenue = Array.isArray(orderRevenueRaw) 
      ? orderRevenueRaw.filter(item => 
          item.period === period || 
          item.time_period === periodMapping[period]
        )
      : [];
    
    // Filter top products for the period
    const filteredProducts = Array.isArray(topProductsRaw)
      ? topProductsRaw.filter(item => 
          item.Period === period || 
          item.period === period
        )
      : [];

    console.log('Filtered data:', {
      periodBasics,
      filteredOrderRevenue,
      filteredProducts: filteredProducts.length
    });

    return {
      basics: convertBasicsData(periodBasics),
      orderRevenueChart: convertOrderRevenueData(filteredOrderRevenue),
      deliveryPerformanceCourier: convertDeliveryPerformanceCourier(deliveryCourierRaw),
      deliveryPerformanceCity: convertDeliveryPerformanceCity(deliveryCityRaw),
      profitBand: convertProfitBand(profitBandRaw),
      topProducts: convertTopProducts(filteredProducts)
    };
  } catch (error) {
    console.error('Error fetching filtered sheet data:', error);
    return getDefaultSheetData();
  }
}

// Default data functions
function getDefaultBasicsData(): BasicsData {
  return {
    total_revenue: 0,
    total_profit: 0,
    total_orders: 0,
    pending_inprogress_orders: 0,
    customers: 0
  };
}

function getDefaultSheetData(): SheetData {
  return {
    basics: getDefaultBasicsData(),
    orderRevenueChart: [],
    deliveryPerformanceCourier: [],
    deliveryPerformanceCity: [],
    profitBand: [],
    topProducts: []
  };
}

// Helper functions for filtering
export function filterProductsByPeriod(products: TopProduct[], period: string): TopProduct[] {
  return products.filter(product => product.Period === period);
}

export function filterOrderRevenueByPeriod(data: OrderRevenueData[], period: string): OrderRevenueData[] {
  return data.filter(item => item.period === period);
}

export function getUniquePeriods(products: TopProduct[]): string[] {
  return [...new Set(products.map(product => product.Period))];
}

export function getUniqueOrderRevenuePeriods(data: OrderRevenueData[]): string[] {
  return [...new Set(data.map(item => item.period))];
}