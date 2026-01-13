// src/lib/googlesheet.ts

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwOpUgbqRGJNy7SVW6e-uc8YpAJ7lYVqeFH-pD0RoM5FkwzhcvoYf-q8r-IUFH42cnY/exec';

export interface BasicsData {
  total_revenue: number;
  total_profit: number;
  total_orders: number;
  pending_inprogress_orders: number;
  customers: number;
}

export interface TopProduct {
  Period: string;
  Category: string;
  Subcategory: string;
  Supplier: string;
  ProductCode: string;
  Product: string;
  ProductStatus: string;
  TotalOrders: number;
  DeliveredOrders: number;
  DeliveryPercentage: number;
}

export interface DeliveryPerformanceData {
  Partner: string;
  Delivered: number;
  Total: number;
  Percentage: number;
}

export interface SheetData {
  basics: BasicsData;
  topProducts: TopProduct[];
  deliveryPerformance: DeliveryPerformanceData[];
}

export async function fetchSheetData(): Promise<SheetData> {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const result = await response.json();
    
    if (result.success) {
      return {
        basics: result.data,
        topProducts: result.topProducts || [],
        deliveryPerformance: result.deliveryPerformance || []
      };
    }
    
    throw new Error('Failed to fetch data from Google Sheet');
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return {
      basics: {
        total_revenue: 0,
        total_profit: 0,
        total_orders: 0,
        pending_inprogress_orders: 0,
        customers: 0
      },
      topProducts: [],
      deliveryPerformance: []
    };
  }
}

// Keep the old function for backwards compatibility
export async function fetchBasicsData(): Promise<BasicsData> {
  const data = await fetchSheetData();
  return data.basics;
}

// Helper function to filter products by period
export function filterProductsByPeriod(products: TopProduct[], period: string): TopProduct[] {
  return products.filter(product => product.Period === period);
}

// Helper function to get unique periods
export function getUniquePeriods(products: TopProduct[]): string[] {
  return [...new Set(products.map(product => product.Period))];
}

// Helper function to fetch delivery performance data
export async function fetchDeliveryPerformanceData(): Promise<DeliveryPerformanceData[]> {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const result = await response.json();
    
    console.log('Google Sheets API Response:', result); // Debug log
    
    // Check if deliveryPerformance exists in response
    if (result.success && result.deliveryPerformance) {
      return result.deliveryPerformance;
    }
    
    // If no deliveryPerformance field, try to find it in other possible locations
    if (result.data && Array.isArray(result.data)) {
      console.log('Trying to extract delivery data from result.data');
      return result.data;
    }
    
    console.log('No delivery performance data found');
    return [];
  } catch (error) {
    console.error('Error fetching delivery performance data:', error);
    return [];
  }
}