import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PhoneCard from "@/components/PhoneCard";
import BrandCard from "@/components/BrandCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sparkles, TrendingUp, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { phones, brands } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [brandFilter, setBrandFilter] = useState("all");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const getBrandName = useCallback((brandId: string) => brands.find((b) => b.id === brandId)?.name || "", [brands]);

  const filteredPhones = useMemo(() => {
    return phones.filter((p) => {
      const matchSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.tagline.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchBrand = brandFilter === "all" || p.brandId === brandFilter;
      return matchSearch && matchPrice && matchBrand;
    });
  }, [phones, debouncedSearch, priceRange, brandFilter]);

  const mostViewed = useMemo(() => [...phones].sort((a, b) => b.views - a.views).slice(0, 4), [phones]);
  const mostLiked = useMemo(() => [...phones].sort((a, b) => b.likes - a.likes).slice(0, 4), [phones]);
  const bestValue = useMemo(() => phones.filter((p) => p.badges.bestValue).slice(0, 4), [phones]);

  const showFiltered = debouncedSearch || brandFilter !== "all" || priceRange[0] > 0 || priceRange[1] < 2000;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container mx-auto px-4 relative">
          <motion.div initial="hidden" animate="visible" className="text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">The #1 Phone Review Platform</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
              Find Your <span className="gradient-text">Perfect</span> Phone
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Compare specs, read reviews, and discover the best smartphones from top brands — all in one place.
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeUp} custom={3} className="mt-8 max-w-lg mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search phones..."
                className="pl-12 h-14 rounded-2xl glass text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-4 mb-10 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1 block">Brand</label>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1 block">Price: ${priceRange[0]} – ${priceRange[1]}</label>
            <Slider min={0} max={2000} step={50} value={priceRange} onValueChange={setPriceRange} className="mt-3" />
          </div>
        </motion.div>

        {/* Filtered results */}
        {showFiltered && (
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold mb-6">
              {filteredPhones.length} result{filteredPhones.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhones.map((p) => (
                <PhoneCard key={p.id} phone={p} brandName={getBrandName(p.brandId)} />
              ))}
            </div>
            {filteredPhones.length === 0 && (
              <p className="text-center text-muted-foreground py-12">No phones match your filters.</p>
            )}
          </section>
        )}

        {/* Brands */}
        {!showFiltered && (
          <>
            <section className="mb-16">
              <h2 className="text-2xl font-display font-bold mb-6">Explore Brands</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {brands.map((b, i) => (
                  <motion.div key={b.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                    <BrandCard brand={b} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Most Viewed */}
            <PhoneSection title="Trending Now" icon={<TrendingUp className="h-6 w-6 text-accent" />} phones={mostViewed} brands={brands} />
            <PhoneSection title="Most Loved" icon={<Heart className="h-6 w-6 text-destructive" />} phones={mostLiked} brands={brands} />
            <PhoneSection title="Best Value" icon={<Award className="h-6 w-6 text-primary" />} phones={bestValue} brands={brands} />
          </>
        )}
      </div>
    </div>
  );
};

const PhoneSection = ({ title, icon, phones, brands }: { title: string; icon: React.ReactNode; phones: any[]; brands: any[] }) => {
  if (!phones.length) return null;
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-display font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {phones.map((p, i) => (
          <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
            <PhoneCard phone={p} brandName={brands.find((b: any) => b.id === p.brandId)?.name} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Index;
