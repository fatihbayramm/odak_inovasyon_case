export const ROUTES = {
  HOME: "/",

  USERS: "/users",
  USER_DETAIL: (id: string) => `/users/${id}`,
  USER_NEW: () => `/users/new`,

  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
} as const;
