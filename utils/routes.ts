export const ROUTES = {
  HOME: "/",

  USERS: "/kullanicilar",
  USER_DETAIL: (id: number) => `/kullanicilar/${id}`,
  USER_NEW: () => `/kullanicilar/yeni`,

  ORDERS: "/siparisler",
  ORDER_DETAIL: (id: number) => `/siparisler/${id}`,
} as const;
