// src/lib/googlesheet.ts

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxQvMRJB4sXof1qdKWQPRhXwsZcStC0WJ5HKILlHa2NyCxhjGs5QVJ5C7OYcjmtqfg/exec';

// Basics sheet data interface
export interface BasicsData {
  time_period: string;
  avg_revenue: number;
  avg_profit: number;
  avg_orders: number;
  pending_orders?: number;
  avg_customers: number;
}

// Order vs Revenue Chart data interface
export interface OrderRevenueData {
  month: number;
  month_name: string;
  total_orders: number;
  total_revenue: number;
}

// Delivery Performance by Courier interface
export interface DeliveryPerformanceCourier {
  partner: string;
  total_orders: number;
  successful_deliveries: number;
  success_rate: number;
  avg_success: number;
}

// Delivery Performance by City interface
export interface DeliveryPerformanceCity {
  city: string;
  total_orders: number;
  successful_deliveries: number;
  success_rate: number;
  avg_success: number;
}

// Profit Band data interface
export interface ProfitBand {
  profit_band: string;
  // 7 Days
  reseller_pay_7d: number;
  money_earned_7d: number;
  potential_earnings_7d: number;
  delivered_7d: number;
  returned_lost_7d: number;
  // 30 Days
  reseller_pay_30d: number;
  money_earned_30d: number;
  potential_earnings_30d: number;
  delivered_30d: number;
  returned_lost_30d: number;
  // 3 Months
  reseller_pay_3m: number;
  money_earned_3m: number;
  potential_earnings_3m: number;
  delivered_3m: number;
  returned_lost_3m: number;
  // 6 Months
  reseller_pay_6m: number;
  money_earned_6m: number;
  potential_earnings_6m: number;
  delivered_6m: number;
  returned_lost_6m: number;
  // 1 Year
  reseller_pay_1y: number;
  money_earned_1y: number;
  potential_earnings_1y: number;
  delivered_1y: number;
  returned_lost_1y: number;
  // All Time
  reseller_pay_all: number;
  money_earned_all: number;
  potential_earnings_all: number;
  delivered_all: number;
  returned_lost_all: number;
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
  DeliveryPercentage: number; // Fixed: was DeliveryPercentile
  ProductStatus?: string;
  Supplier?: string;
}

// Main sheet data interface
export interface SheetData {
  basics: BasicsData[];
  orderRevenueChart: OrderRevenueData[];
  deliveryPerformanceCourier: DeliveryPerformanceCourier[];
  deliveryPerformanceCity: DeliveryPerformanceCity[];
  profitBand: ProfitBand[];
  topProducts: TopProduct[];
}

// Map period names from UI to Google Sheets format
export const periodMapping: Record<string, string> = {
  "7days": "Last 7 Days",
  "30days": "Last 30 Days",
  "3months": "Last 3 Months",
  "6months": "Last 6 Months",
  "1year": "Last 1 Year",
  "lifetime": "All Time"
};

// Map for top products period format
export const productPeriodMapping: Record<string, string> = {
  "7_DAYS": "7_DAYS",
  "30_DAYS": "30_DAYS",
  "3_MONTHS": "3_MONTHS",
  "6_MONTHS": "6_MONTHS",
  "1_YEAR": "1_YEAR",
  "ALL_TIME": "ALL_TIME"
};

// Cache for API data (5 minutes)
let cachedData: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch all data from Google Sheets API (single request that returns all data)
async function fetchAllData(): Promise<any> {
  try {
    // Check cache first
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log('Using cached data');
      return cachedData.data;
    }

    // The API returns all data in a single response
    // Adding cache-busting timestamp to avoid browser caching
    const timestamp = Date.now();
    const url = `${GOOGLE_SHEET_URL}?_=${timestamp}`;
    console.log(`Fetching all data from: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Raw response length:', text.length);
      
      const result = JSON.parse(text);
      console.log('API Response keys:', Object.keys(result));
      
      if (result.success) {
        // Cache the result
        cachedData = { data: result, timestamp: Date.now() };
        return result;
      }
      
      throw new Error('API returned success: false');
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

// Convert basics data from sheet
function convertBasicsData(apiData: any[]): BasicsData[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return getDefaultBasicsData();
  }
  
  return apiData.map(item => ({
    time_period: item.time_period || '',
    avg_revenue: Number(item.avg_revenue || 0),
    avg_profit: Number(item.avg_profit || 0),
    avg_orders: Number(item.avg_orders || 0),
    pending_orders: Number(item.pending_orders || 0),
    avg_customers: Number(item.avg_customers || 0)
  }));
}

// Convert order revenue chart data
function convertOrderRevenueData(apiData: any[]): OrderRevenueData[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    month: Number(item.month || 0),
    month_name: item.month_name || '',
    total_orders: Number(item.total_orders || 0),
    total_revenue: Number(item.total_revenue || 0)
  }));
}

// Convert delivery performance courier data
function convertDeliveryPerformanceCourier(apiData: any[]): DeliveryPerformanceCourier[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    partner: item.partner || '',
    total_orders: Number(item.total_orders || 0),
    successful_deliveries: Number(item.successful_deliveries || 0),
    success_rate: Number(item.success_rate || 0),
    avg_success: Number(item.avg_success || 0)
  }));
}

// Convert delivery performance city data
function convertDeliveryPerformanceCity(apiData: any[]): DeliveryPerformanceCity[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    city: item.city || '',
    total_orders: Number(item.total_orders || 0),
    successful_deliveries: Number(item.successful_deliveries || 0),
    success_rate: Number(item.success_rate || 0),
    avg_success: Number(item.avg_success || 0)
  }));
}

// Convert profit band data
function convertProfitBand(apiData: any[]): ProfitBand[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    profit_band: item['Profit Band'] || item.profit_band || '',
    // 7 Days
    reseller_pay_7d: Number(item['What Resellers Pay (7D)'] || 0),
    money_earned_7d: Number(item['Money Earned (7D)'] || 0),
    potential_earnings_7d: Number(item['Potential Earnings (7D)'] || 0),
    delivered_7d: Number(item['Delivered (7D)'] || 0),
    returned_lost_7d: Number(item['Returned & Lost (7D)'] || 0),
    // 30 Days
    reseller_pay_30d: Number(item['What Resellers Pay (30D)'] || 0),
    money_earned_30d: Number(item['Money Earned (30D)'] || 0),
    potential_earnings_30d: Number(item['Potential Earnings (30D)'] || 0),
    delivered_30d: Number(item['Delivered (30D)'] || 0),
    returned_lost_30d: Number(item['Returned & Lost (30D)'] || 0),
    // 3 Months
    reseller_pay_3m: Number(item['What Resellers Pay (3M)'] || 0),
    money_earned_3m: Number(item['Money Earned (3M)'] || 0),
    potential_earnings_3m: Number(item['Potential Earnings (3M)'] || 0),
    delivered_3m: Number(item['Delivered (3M)'] || 0),
    returned_lost_3m: Number(item['Returned & Lost (3M)'] || 0),
    // 6 Months
    reseller_pay_6m: Number(item['What Resellers Pay (6M)'] || 0),
    money_earned_6m: Number(item['Money Earned (6M)'] || 0),
    potential_earnings_6m: Number(item['Potential Earnings (6M)'] || 0),
    delivered_6m: Number(item['Delivered (6M)'] || 0),
    returned_lost_6m: Number(item['Returned & Lost (6M)'] || 0),
    // 1 Year
    reseller_pay_1y: Number(item['What Resellers Pay (1Y)'] || 0),
    money_earned_1y: Number(item['Money Earned (1Y)'] || 0),
    potential_earnings_1y: Number(item['Potential Earnings (1Y)'] || 0),
    delivered_1y: Number(item['Delivered (1Y)'] || 0),
    returned_lost_1y: Number(item['Returned & Lost (1Y)'] || 0),
    // All Time
    reseller_pay_all: Number(item['What Resellers Pay (All)'] || 0),
    money_earned_all: Number(item['Money Earned (All)'] || 0),
    potential_earnings_all: Number(item['Potential Earnings (All)'] || 0),
    delivered_all: Number(item['Delivered (All)'] || 0),
    returned_lost_all: Number(item['Returned & Lost (All)'] || 0)
  }));
}

// Convert top products data
function convertTopProducts(apiData: any[]): TopProduct[] {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }
  
  return apiData.map(item => ({
    Period: item.Period || '',
    Category: item.Category || '',
    Subcategory: item.Subcategory || '',
    ProductCode: item.ProductCode || '',
    Product: item.Product || '',
    TotalOrders: Number(item.TotalOrders || 0),
    DeliveredOrders: Number(item.DeliveredOrders || 0),
    DeliveryPercentage: Number(item.DeliveryPercentile || 0), // Note: sheet uses DeliveryPercentile
    ProductStatus: 'Active', // Default status
    Supplier: item.Supplier || 'Unknown'
  }));
}

// Main function to fetch all sheet data
export async function fetchSheetData(): Promise<SheetData> {
  try {
    const apiData = await fetchAllData();
    
    if (!apiData) {
      console.error('No data received from API');
      return getDefaultSheetData();
    }

    console.log('Raw data received:', apiData);
    console.log('API Response keys:', Object.keys(apiData));

    // Extract data from the API response - the API returns all data in a single response
    // Note: API uses camelCase keys like orderVsRevenueChart, deliveryPerformanceCity, deliveryPerformanceCourier
    const basicsRaw = apiData.basics || [];
    const orderRevenueRaw = apiData.orderVsRevenueChart || apiData.ordervsrevenuechart || apiData.ordervsrevenueChart || [];
    const deliveryCourierRaw = apiData.deliveryPerformanceCourier || apiData.deliveryperformancecourier || apiData.courierPerformance || [];
    const deliveryCityRaw = apiData.deliveryPerformanceCity || apiData.deliveryperformancecity || apiData.cityPerformance || [];
    const profitBandRaw = apiData.profitband || apiData.profitBand || [];
    const topProductsRaw = apiData.topProducts || apiData.topproducts || [];
    
    console.log('Parsed data lengths:', {
      basics: basicsRaw.length,
      orderRevenue: orderRevenueRaw.length,
      deliveryCourier: deliveryCourierRaw.length,
      deliveryCity: deliveryCityRaw.length,
      profitBand: profitBandRaw.length,
      topProducts: topProductsRaw.length
    });

    return {
      basics: convertBasicsData(basicsRaw),
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

// Helper function to find data for specific period
export function findPeriodData(basicsArray: BasicsData[], period: string): BasicsData {
  if (!Array.isArray(basicsArray) || basicsArray.length === 0) {
    return {
      time_period: period,
      avg_revenue: 0,
      avg_profit: 0,
      avg_orders: 0,
      pending_orders: 0,
      avg_customers: 0
    };
  }
  
  const mappedPeriod = periodMapping[period] || period;
  const periodData = basicsArray.find(item => item.time_period === mappedPeriod);
  
  return periodData || basicsArray[0];
}

// Default data functions
function getDefaultBasicsData(): BasicsData[] {
  return [
    {
      time_period: 'Last 7 Days',
      avg_revenue: 0,
      avg_profit: 0,
      avg_orders: 0,
      pending_orders: 0,
      avg_customers: 0
    }
  ];
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

export function getUniquePeriods(products: TopProduct[]): string[] {
  return [...new Set(products.map(product => product.Period))];
}