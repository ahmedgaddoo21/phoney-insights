import { Link } from "react-router-dom";
import { Phone } from "@/data/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCompare } from "@/contexts/CompareContext";
import { Heart, GitCompareArrows, Star, Eye, ThumbsUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PhoneCardProps {
  phone: Phone;
  brandName?: string;
}

const PhoneCard = ({ phone, brandName }: PhoneCardProps) => {
  const { user, toggleWishlist, isInWishlist } = useAuth();
  const { addToCompare, isInCompare } = useCompare();
  const wishlisted = isInWishlist(phone.id);
  const inCompare = isInCompare(phone.id);

  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      <Link to={`/phone/${phone.id}`} className="block">
        <div className="relative aspect-square bg-muted/50 overflow-hidden">
          <img
            src={phone.images[0]}
            alt={phone.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {phone.badges.mostViewed && <Badge className="gradient-accent text-accent-foreground text-[10px]"><Eye className="h-3 w-3 mr-1" />Most Viewed</Badge>}
            {phone.badges.mostLiked && <Badge className="gradient-warm text-[10px]"><ThumbsUp className="h-3 w-3 mr-1" />Most Liked</Badge>}
            {phone.badges.bestValue && <Badge className="gradient-primary text-primary-foreground text-[10px]"><Award className="h-3 w-3 mr-1" />Best Value</Badge>}
          </div>
        </div>
      </Link>

      <div className="p-4">
        {brandName && <p className="text-xs text-muted-foreground mb-1">{brandName}</p>}
        <Link to={`/phone/${phone.id}`}>
          <h3 className="font-display font-semibold text-lg leading-tight hover:text-primary transition-colors">{phone.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{phone.tagline}</p>

        <div className="flex items-center gap-2 mt-2">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{phone.rating}</span>
          <span className="text-xs text-muted-foreground">({phone.ratingCount})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-display font-bold">${phone.price}</span>
          <div className="flex gap-1">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => { e.preventDefault(); toggleWishlist(phone.id); }}
              >
                <Heart className={`h-4 w-4 transition-all ${wishlisted ? "fill-destructive text-destructive animate-heart-beat" : ""}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${inCompare ? "text-primary" : ""}`}
              onClick={(e) => { e.preventDefault(); addToCompare(phone); }}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCard;
