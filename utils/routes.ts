export const ROUTES = {
  HOME: "/",

  USERS: "/kullanicilar",
  USER_DETAIL: (id: number) => `/kullanicilar/${id}`,

  ORDERS: "/siparisler",
  ORDER_DETAIL: (id: number) => `/siparisler/${id}`,
} as const;
