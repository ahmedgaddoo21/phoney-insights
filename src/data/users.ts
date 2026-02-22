import { User } from "./types";

export const defaultUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@phoney.com",
    password: "Admin123!",
    name: "Admin",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    wishlist: [],
  },
  {
    id: "user-1",
    email: "demo@phoney.com",
    password: "Demo123!",
    name: "Demo User",
    role: "user",
    createdAt: "2024-06-15T00:00:00Z",
    wishlist: ["iphone-16-pro-max", "galaxy-s24-ultra"],
  },
];

export const defaultComments = [
  { id: "c1", phoneId: "iphone-16-pro-max", userId: "user-1", userName: "Demo User", text: "Best iPhone yet! The camera is incredible.", rating: 5, createdAt: "2024-10-01T10:00:00Z" },
  { id: "c2", phoneId: "galaxy-s24-ultra", userId: "user-1", userName: "Demo User", text: "Galaxy AI features are genuinely useful. S Pen is a bonus.", rating: 4, createdAt: "2024-03-15T14:30:00Z" },
  { id: "c3", phoneId: "oneplus-12", userId: "user-1", userName: "Demo User", text: "100W charging is insane. Love the Hasselblad colors.", rating: 5, createdAt: "2024-04-20T09:00:00Z" },
];
