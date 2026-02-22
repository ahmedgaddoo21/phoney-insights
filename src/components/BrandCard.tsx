import { Link } from "react-router-dom";
import { Brand } from "@/data/types";
import { ChevronRight } from "lucide-react";

const BrandCard = ({ brand }: { brand: Brand }) => (
  <Link
    to={`/brand/${brand.id}`}
    className="group glass rounded-2xl p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 flex flex-col items-center text-center"
  >
    <span className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{brand.logo}</span>
    <h3 className="font-display font-semibold text-lg">{brand.name}</h3>
    <p className="text-xs text-muted-foreground mt-1">{brand.country} · {brand.founded}</p>
    <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Explore <ChevronRight className="h-4 w-4" />
    </div>
  </Link>
);

export default BrandCard;
