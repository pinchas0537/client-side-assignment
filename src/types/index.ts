export interface Item {
  _id: string;
  name: string;
  price?: number;
  consumerPrice?: number;
  stock: number;
  category: string;
  supplier?: string | Supplier;
  supplierId?: string | Supplier;
  image?: string;
  description?: string;
}

export interface SupplierItem {
  name: string;
  price: number;
}

export interface Supplier {
  _id: string;
  name: string;
  items: SupplierItem[];
}

export interface OrderItem {
  item: string | Item;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  address: string;
  orderDate: string;
  shopProfit: number;
}

export interface AnalyticsRevenue {
  revenue: number;
}

export interface AnalyticsCategory {
  category: string;
  profit: number;
}

export interface AnalyticsTopItem {
  item: Item;
  profit: number;
}

export interface AnalyticsMargins {
  highest: { item: Item; margin: number };
  lowest: { item: Item; margin: number };
}

export interface AnalyticsTopSupplier {
  supplier: Supplier;
  profit: number;
}

export interface AnalyticsSupplierSpent {
  supplier: Supplier;
  spent: number;
}
