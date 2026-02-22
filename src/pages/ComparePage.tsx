import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const { phones } = useAuth();
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    if (!search) return [];
    return phones
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) && !compareList.find((c) => c.id === p.id))
      .slice(0, 5);
  }, [search, phones, compareList]);

  const specKeys = [
    { key: "display", label: "Display" },
    { key: "displaySize", label: "Display Size" },
    { key: "cpu", label: "CPU" },
    { key: "gpu", label: "GPU" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "mainCamera", label: "Main Camera" },
    { key: "battery", label: "Battery" },
    { key: "charging", label: "Charging" },
    { key: "waterResistance", label: "Water Resistance" },
  ];

  const benchmarkKeys = [
    { key: "antutu", label: "AnTuTu", max: 2200000 },
    { key: "geekbenchSingle", label: "Geekbench (S)", max: 4000 },
    { key: "geekbenchMulti", label: "Geekbench (M)", max: 10000 },
    { key: "gpu", label: "GPU Score", max: 30000 },
  ];

  const getBestValue = (key: string) => {
    if (!compareList.length) return -1;
    const values = compareList.map((p) => (p.benchmark as any)[key] as number);
    return values.indexOf(Math.max(...values));
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold mb-2">Compare Phones</h1>
      <p className="text-muted-foreground mb-8">Select 2-3 phones to compare side by side</p>

      {/* Add phone */}
      {compareList.length < 3 && (
        <div className="relative max-w-sm mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search to add..." className="pl-10 rounded-xl" value={search} onChange={(e) => setSearch(e.target.value)} />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full glass rounded-xl overflow-hidden z-10">
              {searchResults.map((p) => (
                <button key={p.id} className="w-full text-left px-4 py-2 hover:bg-muted text-sm flex items-center gap-3" onClick={() => { addToCompare(p); setSearch(""); }}>
                  <Plus className="h-4 w-4 text-primary" /> {p.name} — ${p.price}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {compareList.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-muted-foreground text-lg mb-4">No phones added yet</p>
          <Link to="/"><Button>Browse Phones</Button></Link>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={clearCompare}>Clear All</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 text-sm text-muted-foreground w-[160px]">Phone</th>
                  {compareList.map((p) => (
                    <th key={p.id} className="p-3 text-center">
                      <div className="glass rounded-xl p-4 relative">
                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeFromCompare(p.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                        <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                        <Link to={`/phone/${p.id}`} className="font-display font-semibold text-sm hover:text-primary">{p.name}</Link>
                        <p className="text-lg font-bold mt-1">${p.price}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specKeys.map((spec, i) => (
                  <tr key={spec.key} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                    <td className="p-3 text-sm text-muted-foreground">{spec.label}</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-center text-sm">{(p.specs as any)[spec.key]}</td>
                    ))}
                  </tr>
                ))}
                <tr><td colSpan={compareList.length + 1} className="p-3 font-display font-bold text-lg">Benchmarks</td></tr>
                {benchmarkKeys.map((bk) => {
                  const bestIdx = getBestValue(bk.key);
                  return (
                    <tr key={bk.key}>
                      <td className="p-3 text-sm text-muted-foreground">{bk.label}</td>
                      {compareList.map((p, idx) => {
                        const val = (p.benchmark as any)[bk.key] as number;
                        return (
                          <td key={p.id} className="p-3">
                            <div className="text-center text-sm mb-1">
                              <span className={idx === bestIdx ? "text-success font-bold" : ""}>{val.toLocaleString()}</span>
                            </div>
                            <Progress value={(val / bk.max) * 100} className="h-2" />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="bg-muted/20">
                  <td className="p-3 text-sm font-semibold">Price</td>
                  {compareList.map((p, idx) => {
                    const cheapest = compareList.reduce((min, c) => c.price < min ? c.price : min, Infinity);
                    return (
                      <td key={p.id} className="p-3 text-center">
                        <span className={`text-lg font-bold ${p.price === cheapest ? "text-success" : ""}`}>${p.price}</span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePage;
