import { api } from "./axios";

const BASE_URL = "/analytics";

export const getMonthlyRevenue = async () => {
  const { data } = await api.get(`${BASE_URL}/monthly-revenue`);
  return data.data; // returns a number
};

export const getWeeklyTopCategory = async () => {
  const { data } = await api.get(`${BASE_URL}/top-category`);
  return data.data; // returns { _id, totalProfit }
};

export const getDailyTopItem = async () => {
  const { data } = await api.get(`${BASE_URL}/daily-top-item`);
  return data.data; // returns null or { _id, totalProfit }
};

export const getItemMargins = async () => {
  const { data } = await api.get(`${BASE_URL}/item-margins`);
  return data.data; // returns { highest: { _id, name, margin }, lowest: { _id, name, margin } }
};

export const getMostProfitableSupplier = async () => {
  const { data } = await api.get(`${BASE_URL}/top-supplier`);
  return data.data; // returns { _id, totalProfit }
};
