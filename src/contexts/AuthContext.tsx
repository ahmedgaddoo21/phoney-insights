import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Comment } from "@/data/types";
import { defaultUsers, defaultComments } from "@/data/users";
import { phones as defaultPhones } from "@/data/phones";
import { brands as defaultBrands } from "@/data/brands";
import { Phone, Brand } from "@/data/types";
import { toast } from "@/hooks/use-toast";

// Sanitize input to prevent XSS
const sanitize = (str: string): string =>
  str.replace(/[<>"'&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "&": "&amp;" }[c] || c));

interface AuthContextType {
  user: User | null;
  users: User[];
  phones: Phone[];
  brands: Brand[];
  comments: Comment[];
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  // Wishlist
  toggleWishlist: (phoneId: string) => void;
  isInWishlist: (phoneId: string) => boolean;
  // Comments
  addComment: (phoneId: string, text: string, rating: number) => void;
  deleteComment: (commentId: string) => void;
  // Admin
  addPhone: (phone: Phone) => void;
  updatePhone: (phone: Phone) => void;
  deletePhone: (phoneId: string) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (brand: Brand) => void;
  deleteBrand: (brandId: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEYS = {
  session: "phoney-session",
  users: "phoney-users",
  phones: "phoney-phones",
  brands: "phoney-brands",
  comments: "phoney-comments",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => loadFromStorage(STORAGE_KEYS.users, defaultUsers));
  const [phones, setPhones] = useState<Phone[]>(() => loadFromStorage(STORAGE_KEYS.phones, defaultPhones));
  const [brands, setBrands] = useState<Brand[]>(() => loadFromStorage(STORAGE_KEYS.brands, defaultBrands));
  const [comments, setComments] = useState<Comment[]>(() => loadFromStorage(STORAGE_KEYS.comments, defaultComments));
  const [user, setUser] = useState<User | null>(() => {
    const sessionId = localStorage.getItem(STORAGE_KEYS.session);
    if (!sessionId) return null;
    const allUsers = loadFromStorage<User[]>(STORAGE_KEYS.users, defaultUsers);
    return allUsers.find((u) => u.id === sessionId) || null;
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.phones, JSON.stringify(phones)); }, [phones]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.brands, JSON.stringify(brands)); }, [brands]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(comments)); }, [comments]);

  const login = useCallback((email: string, password: string): boolean => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEYS.session, found.id);
      toast({ title: "Welcome back!", description: `Logged in as ${found.name}` });
      return true;
    }
    toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
    return false;
  }, [users]);

  const register = useCallback((email: string, password: string, name: string): boolean => {
    if (users.find((u) => u.email === email)) {
      toast({ title: "Registration failed", description: "Email already exists", variant: "destructive" });
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: sanitize(email),
      password,
      name: sanitize(name),
      role: "user",
      createdAt: new Date().toISOString(),
      wishlist: [],
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.session, newUser.id);
    toast({ title: "Welcome to Phoney!", description: "Account created successfully" });
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.session);
    toast({ title: "Logged out", description: "See you soon!" });
  }, []);

  const toggleWishlist = useCallback((phoneId: string) => {
    if (!user) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== user.id) return u;
        const wl = u.wishlist.includes(phoneId)
          ? u.wishlist.filter((id) => id !== phoneId)
          : [...u.wishlist, phoneId];
        return { ...u, wishlist: wl };
      })
    );
    setUser((prev) => {
      if (!prev) return null;
      const wl = prev.wishlist.includes(phoneId)
        ? prev.wishlist.filter((id) => id !== phoneId)
        : [...prev.wishlist, phoneId];
      return { ...prev, wishlist: wl };
    });
  }, [user]);

  const isInWishlist = useCallback((phoneId: string) => user?.wishlist.includes(phoneId) || false, [user]);

  const addComment = useCallback((phoneId: string, text: string, rating: number) => {
    if (!user) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      phoneId,
      userId: user.id,
      userName: user.name,
      text: sanitize(text),
      rating,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [comment, ...prev]);
  }, [user]);

  const deleteComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  // Admin operations
  const addPhone = useCallback((phone: Phone) => setPhones((prev) => [phone, ...prev]), []);
  const updatePhone = useCallback((phone: Phone) => setPhones((prev) => prev.map((p) => (p.id === phone.id ? phone : p))), []);
  const deletePhone = useCallback((phoneId: string) => setPhones((prev) => prev.filter((p) => p.id !== phoneId)), []);
  const addBrand = useCallback((brand: Brand) => setBrands((prev) => [...prev, brand]), []);
  const updateBrand = useCallback((brand: Brand) => setBrands((prev) => prev.map((b) => (b.id === brand.id ? brand : b))), []);
  const deleteBrand = useCallback((brandId: string) => setBrands((prev) => prev.filter((b) => b.id !== brandId)), []);

  return (
    <AuthContext.Provider
      value={{
        user, users, phones, brands, comments,
        login, register, logout,
        isAdmin: user?.role === "admin",
        toggleWishlist, isInWishlist,
        addComment, deleteComment,
        addPhone, updatePhone, deletePhone,
        addBrand, updateBrand, deleteBrand,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
