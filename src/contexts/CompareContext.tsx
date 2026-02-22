import React, { createContext, useContext, useState, useCallback } from "react";
import { Phone } from "@/data/types";
import { toast } from "@/hooks/use-toast";

interface CompareContextType {
  compareList: Phone[];
  addToCompare: (phone: Phone) => void;
  removeFromCompare: (phoneId: string) => void;
  clearCompare: () => void;
  isInCompare: (phoneId: string) => boolean;
}

const CompareContext = createContext<CompareContextType>({} as CompareContextType);
export const useCompare = () => useContext(CompareContext);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Phone[]>([]);

  const addToCompare = useCallback((phone: Phone) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === phone.id)) {
        toast({ title: "Already added", description: `${phone.name} is already in comparison` });
        return prev;
      }
      if (prev.length >= 3) {
        toast({ title: "Limit reached", description: "You can compare up to 3 phones", variant: "destructive" });
        return prev;
      }
      toast({ title: "Added to compare", description: phone.name });
      return [...prev, phone];
    });
  }, []);

  const removeFromCompare = useCallback((phoneId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== phoneId));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);
  const isInCompare = useCallback((phoneId: string) => compareList.some((p) => p.id === phoneId), [compareList]);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
