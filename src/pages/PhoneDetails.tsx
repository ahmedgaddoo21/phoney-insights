import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, GitCompareArrows, Star, ChevronLeft, ChevronRight, Share2, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const PhoneDetails = () => {
  const { phoneId } = useParams();
  const { phones, brands, user, toggleWishlist, isInWishlist, comments, addComment, deleteComment } = useAuth();
  const { addToCompare } = useCompare();
  const phone = phones.find((p) => p.id === phoneId);
  const brand = phone ? brands.find((b) => b.id === phone.brandId) : null;

  const [imgIdx, setImgIdx] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);

  const phoneComments = useMemo(() => comments.filter((c) => c.phoneId === phoneId), [comments, phoneId]);

  if (!phone || !brand) return <div className="container mx-auto px-4 py-20 text-center"><h1 className="text-2xl">Phone not found</h1></div>;

  const maxBenchmark = { antutu: 2200000, geekbenchSingle: 4000, geekbenchMulti: 10000, gpu: 30000 };
  const benchmarks = [
    { label: "AnTuTu", value: phone.benchmark.antutu, max: maxBenchmark.antutu, display: phone.benchmark.antutu.toLocaleString() },
    { label: "Geekbench Single", value: phone.benchmark.geekbenchSingle, max: maxBenchmark.geekbenchSingle, display: phone.benchmark.geekbenchSingle.toLocaleString() },
    { label: "Geekbench Multi", value: phone.benchmark.geekbenchMulti, max: maxBenchmark.geekbenchMulti, display: phone.benchmark.geekbenchMulti.toLocaleString() },
    { label: "GPU Score", value: phone.benchmark.gpu, max: maxBenchmark.gpu, display: phone.benchmark.gpu.toLocaleString() },
  ];

  const specs = Object.entries(phone.specs).map(([key, val]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    value: val,
  }));

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Share it with your friends" });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(phone.id, commentText, commentRating);
    setCommentText("");
    setCommentRating(5);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to={`/brand/${brand.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to {brand.name}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative glass rounded-2xl overflow-hidden aspect-square">
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={phone.images[imgIdx]}
                alt={phone.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
              />
            </AnimatePresence>
            {phone.images.length > 1 && (
              <>
                <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 glass rounded-full" onClick={() => setImgIdx((i) => (i - 1 + phone.images.length) % phone.images.length)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 glass rounded-full" onClick={() => setImgIdx((i) => (i + 1) % phone.images.length)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {phone.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`h-2 w-2 rounded-full transition-all ${i === imgIdx ? "bg-primary w-6" : "bg-muted-foreground/40"}`} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <p className="text-sm text-muted-foreground">{brand.name}</p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mt-1">{phone.name}</h1>
          <p className="text-muted-foreground mt-2">{phone.tagline}</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(phone.rating) ? "fill-warning text-warning" : "text-muted"}`} />
              ))}
            </div>
            <span className="font-semibold">{phone.rating}</span>
            <span className="text-sm text-muted-foreground">({phone.ratingCount} reviews)</span>
          </div>

          <p className="text-4xl font-display font-bold mt-6">${phone.price}</p>

          <div className="flex gap-3 mt-6">
            {user && (
              <Button
                variant={isInWishlist(phone.id) ? "default" : "outline"}
                className={isInWishlist(phone.id) ? "gradient-warm" : ""}
                onClick={() => toggleWishlist(phone.id)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(phone.id) ? "fill-current" : ""}`} />
                {isInWishlist(phone.id) ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            )}
            <Button variant="outline" onClick={() => addToCompare(phone)}>
              <GitCompareArrows className="h-4 w-4 mr-2" /> Compare
            </Button>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { label: "Display", value: phone.specs.displaySize },
              { label: "CPU", value: phone.specs.cpu },
              { label: "RAM", value: phone.specs.ram },
              { label: "Battery", value: phone.specs.battery },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-medium text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* YouTube */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-bold mb-6">Video Review</h2>
        <div className="aspect-video glass rounded-2xl overflow-hidden max-w-3xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${phone.youtubeReviewId}`}
            title="YouTube review"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </section>

      {/* Benchmarks */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-bold mb-6">Benchmark Scores</h2>
        <div className="grid gap-4 max-w-2xl">
          {benchmarks.map((b) => (
            <div key={b.label} className="glass rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{b.label}</span>
                <span className="text-muted-foreground">{b.display}</span>
              </div>
              <Progress value={(b.value / b.max) * 100} className="h-3" />
            </div>
          ))}
        </div>
      </section>

      {/* Full Specs */}
      <section className="mt-16">
        <h2 className="text-2xl font-display font-bold mb-6">Full Specifications</h2>
        <div className="glass rounded-2xl overflow-hidden max-w-2xl">
          {specs.map((s, i) => (
            <div key={s.label} className={`flex justify-between p-4 ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <span className="text-sm font-medium text-right max-w-[60%]">{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      {phone.tips.length > 0 && (
        <section className="mt-16 max-w-2xl">
          <Collapsible open={tipsOpen} onOpenChange={setTipsOpen}>
            <CollapsibleTrigger className="flex items-center gap-3 w-full">
              <h2 className="text-2xl font-display font-bold">Tips & Tricks</h2>
              {tipsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="glass rounded-2xl p-6 space-y-3">
                {phone.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-primary font-bold">{i + 1}.</span>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      )}

      {/* Comments */}
      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-display font-bold mb-6">Reviews ({phoneComments.length})</h2>

        {user && (
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">Your rating:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setCommentRating(s)}>
                  <Star className={`h-5 w-5 ${s <= commentRating ? "fill-warning text-warning" : "text-muted"}`} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Write your review..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="mb-3" />
            <Button onClick={handleComment} disabled={!commentText.trim()}>
              <Send className="h-4 w-4 mr-2" /> Post Review
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {phoneComments.map((c) => (
            <div key={c.id} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{c.userName}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= c.rating ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                  {(user?.id === c.userId || user?.role === "admin") && (
                    <Button variant="ghost" size="sm" className="text-xs text-destructive h-6" onClick={() => deleteComment(c.id)}>Delete</Button>
                  )}
                </div>
              </div>
              <p className="text-sm">{c.text}</p>
            </div>
          ))}
          {phoneComments.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No reviews yet. Be the first!</p>}
        </div>
      </section>
    </div>
  );
};

export default PhoneDetails;
