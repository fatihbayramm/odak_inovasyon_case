export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  quantity: string;
  total: string;
}

export enum OrderStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  CANCELLED = "cancelled",
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.COMPLETED]: "Tamamlandı",
  [OrderStatus.PENDING]: "Bekliyor",
  [OrderStatus.CANCELLED]: "İptal Edildi",
};

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  totalPrice: string;
}

export interface CreateOrUpdateOrder {
  id?: string;
  userId: string;
  orderNumber?: string;
  status?: OrderStatus;
  createdAt?: string;
  items: OrderItem[];
  totalPrice?: string;
}

export async function getOrders(filters?: { createdAt_gte?: string; createdAt_lte?: string }): Promise<Order[]> {
  const url = new URL("http://localhost:4000/orders");

  if (filters?.createdAt_gte) {
    url.searchParams.append("createdAt_gte", filters.createdAt_gte);
  }
  if (filters?.createdAt_lte) {
    url.searchParams.append("createdAt_lte", filters.createdAt_lte);
  }

  const finalUrl = url.toString();
  console.log("Fetching orders from:", finalUrl);

  const response = await fetch(finalUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export async function getOrder(id: string | number): Promise<Order> {
  const response = await fetch(`http://localhost:4000/orders/${String(id)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
}

export async function createOrder(order: CreateOrUpdateOrder): Promise<Order> {
  const response = await fetch(`http://localhost:4000/orders`, {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  return response.json();
}

export async function updateOrder(id: string | number, order: CreateOrUpdateOrder): Promise<Order> {
  const response = await fetch(`http://localhost:4000/orders/${String(id)}`, {
    method: "PUT",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to update order");
  }
  return response.json();
}

export async function deleteOrder(id: string | number): Promise<void> {
  const response = await fetch(`http://localhost:4000/orders/${String(id)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
}
