import { api } from "./axios";
import type { 
  AnalyticsRevenue, 
  AnalyticsCategory, 
  AnalyticsTopItem, 
  AnalyticsMargins, 
  AnalyticsTopSupplier 
} from "../types";

// Adjust this base URL if the analytics routes are mounted differently in the server
const BASE_URL = "/analytics";

export const getMonthlyRevenue = async (): Promise<AnalyticsRevenue> => {
  const { data } = await api.get(`${BASE_URL}/monthly-revenue`);
  return data;
};

export const getWeeklyTopCategory = async (): Promise<AnalyticsCategory> => {
  const { data } = await api.get(`${BASE_URL}/top-category`);
  return data;
};

export const getDailyTopItem = async (): Promise<AnalyticsTopItem> => {
  const { data } = await api.get(`${BASE_URL}/daily-top-item`);
  return data;
};

export const getItemMargins = async (): Promise<AnalyticsMargins> => {
  const { data } = await api.get(`${BASE_URL}/item-margins`);
  return data;
};

export const getMostProfitableSupplier = async (): Promise<AnalyticsTopSupplier> => {
  const { data } = await api.get(`${BASE_URL}/top-supplier`);
  return data;
};
