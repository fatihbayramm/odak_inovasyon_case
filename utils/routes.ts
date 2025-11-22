export const ROUTES = {
  HOME: "/",

  USERS: "/kullanicilar",
  USER_DETAIL: (id: string) => `/kullanicilar/${id}`,
  USER_NEW: () => `/kullanicilar/yeni`,

  ORDERS: "/siparisler",
  ORDER_DETAIL: (id: string) => `/siparisler/${id}`,
} as const;
