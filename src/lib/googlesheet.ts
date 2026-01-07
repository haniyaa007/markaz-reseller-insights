// src/lib/googlesheet.ts

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxfhMXCWXqSIGY7Cl6GMUvHFxadDzMbomhuvRppeGhYWfsbu09SiA8YKlOwC3EIT3Ru/exec';

export interface BasicsData {
  total_revenue: number;
  total_profit: number;
  total_orders: number;
  pending_inprogress_orders: number;
  customers: number;
}

export async function fetchBasicsData(): Promise<BasicsData> {
  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Failed to fetch data from Google Sheet');
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    // Return fallback data if fetch fails
    return {
      total_revenue: 0,
      total_profit: 0,
      total_orders: 0,
      pending_inprogress_orders: 0,
      customers: 0
    };
  }
}