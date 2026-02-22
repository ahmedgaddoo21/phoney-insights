import { useAuth } from "@/contexts/AuthContext";
import PhoneCard from "@/components/PhoneCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WishlistPage = () => {
  const { phones, user } = useAuth();
  const wishlistPhones = phones.filter((p) => user?.wishlist.includes(p.id));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-7 w-7 text-destructive" />
        <h1 className="text-3xl font-display font-bold">My Wishlist</h1>
      </div>

      {wishlistPhones.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground mb-4">Your wishlist is empty</p>
          <Link to="/"><Button>Browse Phones</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistPhones.map((p) => <PhoneCard key={p.id} phone={p} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
