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

// Fetch data from specific sheet
async function fetchFromSheet(sheetName: string): Promise<any> {
  try {
    const response = await fetch(`${GOOGLE_SHEET_URL}?sheet=${sheetName}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error(`Failed to fetch data from ${sheetName} sheet`);
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    return null;
  }
}

// Main function to fetch all sheet data
export async function fetchSheetData(): Promise<SheetData> {
  try {
    const [basics, orderRevenueChart, deliveryPerformanceCourier, deliveryPerformanceCity, profitBand, topProducts] = await Promise.all([
      fetchFromSheet('basics'),
      fetchFromSheet('ordervsrevenuechart'),
      fetchFromSheet('deliveryperformancecourier'),
      fetchFromSheet('deliveryperformancecity'),
      fetchFromSheet('profitband'),
      fetchFromSheet('topproducts')
    ]);

    return {
      basics: basics || getDefaultBasicsData(),
      orderRevenueChart: orderRevenueChart || [],
      deliveryPerformanceCourier: deliveryPerformanceCourier || [],
      deliveryPerformanceCity: deliveryPerformanceCity || [],
      profitBand: profitBand || [],
      topProducts: topProducts || []
    };
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return getDefaultSheetData();
  }
}

// Fetch data for specific time period
export async function fetchSheetDataByPeriod(period: string): Promise<SheetData> {
  try {
    const data = await fetchSheetData();
    
    // Filter data based on period
    const filteredData: SheetData = {
      ...data,
      topProducts: data.topProducts.filter(product => product.Period === period),
      orderRevenueChart: data.orderRevenueChart.filter(item => item.period === period),
      deliveryPerformanceCourier: data.deliveryPerformanceCourier,
      deliveryPerformanceCity: data.deliveryPerformanceCity,
      profitBand: data.profitBand
    };

    return filteredData;
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