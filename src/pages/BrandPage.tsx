import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import PhoneCard from "@/components/PhoneCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const BrandPage = () => {
  const { brandId } = useParams();
  const { phones, brands } = useAuth();
  const brand = brands.find((b) => b.id === brandId);
  const [sort, setSort] = useState("newest");

  const brandPhones = useMemo(() => {
    const filtered = phones.filter((p) => p.brandId === brandId);
    switch (sort) {
      case "price-asc": return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc": return [...filtered].sort((a, b) => b.price - a.price);
      case "performance": return [...filtered].sort((a, b) => b.benchmark.antutu - a.benchmark.antutu);
      case "popular": return [...filtered].sort((a, b) => b.views - a.views);
      default: return [...filtered].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    }
  }, [phones, brandId, sort]);

  if (!brand) return <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl">Brand not found</h1></div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl">{brand.logo}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">{brand.name}</h1>
            <p className="text-muted-foreground">{brand.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{brandPhones.length} phones</p>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low → High</SelectItem>
            <SelectItem value="price-desc">Price: High → Low</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="popular">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brandPhones.map((p) => <PhoneCard key={p.id} phone={p} />)}
      </div>
    </div>
  );
};

export default BrandPage;
