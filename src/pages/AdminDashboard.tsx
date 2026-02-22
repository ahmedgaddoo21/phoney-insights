import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Phone, Brand } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Smartphone, Building2, MessageSquare, Plus, Pencil, Trash2, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { phones, brands, comments, addPhone, updatePhone, deletePhone, addBrand, updateBrand, deleteBrand, deleteComment } = useAuth();
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [brandDialog, setBrandDialog] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Phone form state
  const [pForm, setPForm] = useState({
    name: "", tagline: "", brandId: "", price: 0, youtubeReviewId: "",
    releaseDate: "", rating: 4.5, ratingCount: 0, views: 0, likes: 0,
    mostViewed: false, mostLiked: false, bestValue: false,
    // Specs
    display: "", displaySize: "", resolution: "", refreshRate: "", cpu: "", gpu: "",
    ram: "", storage: "", mainCamera: "", selfieCamera: "", battery: "", charging: "",
    os: "", weight: "", dimensions: "", waterResistance: "", connectivity: "",
    // Benchmarks
    antutu: 0, geekbenchSingle: 0, geekbenchMulti: 0, gpuScore: 0,
    tips: "",
  });

  const [bForm, setBForm] = useState({ name: "", logo: "", description: "", founded: 2020, country: "", color: "" });

  const openPhoneEdit = (phone: Phone) => {
    setEditingPhone(phone);
    setPForm({
      name: phone.name, tagline: phone.tagline, brandId: phone.brandId, price: phone.price,
      youtubeReviewId: phone.youtubeReviewId, releaseDate: phone.releaseDate,
      rating: phone.rating, ratingCount: phone.ratingCount, views: phone.views, likes: phone.likes,
      mostViewed: !!phone.badges.mostViewed, mostLiked: !!phone.badges.mostLiked, bestValue: !!phone.badges.bestValue,
      ...phone.specs,
      antutu: phone.benchmark.antutu, geekbenchSingle: phone.benchmark.geekbenchSingle,
      geekbenchMulti: phone.benchmark.geekbenchMulti, gpuScore: phone.benchmark.gpu,
      tips: phone.tips.join("\n"),
    });
    setPhoneDialog(true);
  };

  const openPhoneNew = () => {
    setEditingPhone(null);
    setPForm({
      name: "", tagline: "", brandId: brands[0]?.id || "", price: 0, youtubeReviewId: "dQw4w9WgXcQ",
      releaseDate: new Date().toISOString().split("T")[0], rating: 4.5, ratingCount: 0, views: 0, likes: 0,
      mostViewed: false, mostLiked: false, bestValue: false,
      display: "", displaySize: "", resolution: "", refreshRate: "", cpu: "", gpu: "",
      ram: "", storage: "", mainCamera: "", selfieCamera: "", battery: "", charging: "",
      os: "", weight: "", dimensions: "", waterResistance: "", connectivity: "",
      antutu: 0, geekbenchSingle: 0, geekbenchMulti: 0, gpuScore: 0, tips: "",
    });
    setPhoneDialog(true);
  };

  const savePhone = () => {
    const phone: Phone = {
      id: editingPhone?.id || `phone-${Date.now()}`,
      brandId: pForm.brandId,
      name: pForm.name,
      tagline: pForm.tagline,
      images: editingPhone?.images || ["/placeholder.svg"],
      price: Number(pForm.price),
      releaseDate: pForm.releaseDate,
      specs: {
        display: pForm.display, displaySize: pForm.displaySize, resolution: pForm.resolution,
        refreshRate: pForm.refreshRate, cpu: pForm.cpu, gpu: pForm.gpu, ram: pForm.ram,
        storage: pForm.storage, mainCamera: pForm.mainCamera, selfieCamera: pForm.selfieCamera,
        battery: pForm.battery, charging: pForm.charging, os: pForm.os, weight: pForm.weight,
        dimensions: pForm.dimensions, waterResistance: pForm.waterResistance, connectivity: pForm.connectivity,
      },
      benchmark: { antutu: Number(pForm.antutu), geekbenchSingle: Number(pForm.geekbenchSingle), geekbenchMulti: Number(pForm.geekbenchMulti), gpu: Number(pForm.gpuScore) },
      youtubeReviewId: pForm.youtubeReviewId,
      tips: pForm.tips.split("\n").filter(Boolean),
      rating: Number(pForm.rating),
      ratingCount: Number(pForm.ratingCount),
      views: Number(pForm.views),
      likes: Number(pForm.likes),
      badges: { mostViewed: pForm.mostViewed, mostLiked: pForm.mostLiked, bestValue: pForm.bestValue },
    };
    editingPhone ? updatePhone(phone) : addPhone(phone);
    setPhoneDialog(false);
    toast({ title: editingPhone ? "Phone updated" : "Phone added" });
  };

  const openBrandEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setBForm({ name: brand.name, logo: brand.logo, description: brand.description, founded: brand.founded, country: brand.country, color: brand.color });
    setBrandDialog(true);
  };

  const openBrandNew = () => {
    setEditingBrand(null);
    setBForm({ name: "", logo: "📱", description: "", founded: 2020, country: "", color: "hsl(200 60% 50%)" });
    setBrandDialog(true);
  };

  const saveBrand = () => {
    const brand: Brand = {
      id: editingBrand?.id || `brand-${Date.now()}`,
      ...bForm,
      founded: Number(bForm.founded),
    };
    editingBrand ? updateBrand(brand) : addBrand(brand);
    setBrandDialog(false);
    toast({ title: editingBrand ? "Brand updated" : "Brand added" });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
      </div>

      <Tabs defaultValue="phones">
        <TabsList className="glass mb-6">
          <TabsTrigger value="phones" className="gap-2"><Smartphone className="h-4 w-4" /> Phones ({phones.length})</TabsTrigger>
          <TabsTrigger value="brands" className="gap-2"><Building2 className="h-4 w-4" /> Brands ({brands.length})</TabsTrigger>
          <TabsTrigger value="comments" className="gap-2"><MessageSquare className="h-4 w-4" /> Comments ({comments.length})</TabsTrigger>
        </TabsList>

        {/* Phones */}
        <TabsContent value="phones">
          <Button onClick={openPhoneNew} className="mb-4 gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add Phone</Button>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left p-3">Name</th><th className="text-left p-3">Brand</th><th className="text-left p-3">Price</th><th className="text-left p-3">Badges</th><th className="p-3">Actions</th>
                </tr></thead>
                <tbody>
                  {phones.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{brands.find((b) => b.id === p.brandId)?.name}</td>
                      <td className="p-3">${p.price}</td>
                      <td className="p-3 text-xs space-x-1">
                        {p.badges.mostViewed && <span className="text-accent">👁</span>}
                        {p.badges.mostLiked && <span className="text-destructive">❤️</span>}
                        {p.badges.bestValue && <span className="text-primary">⭐</span>}
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openPhoneEdit(p)}><Pencil className="h-3 w-3" /></Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete {p.name}?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deletePhone(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Brands */}
        <TabsContent value="brands">
          <Button onClick={openBrandNew} className="mb-4 gradient-primary text-primary-foreground"><Plus className="h-4 w-4 mr-2" /> Add Brand</Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((b) => (
              <div key={b.id} className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{b.logo}</span>
                  <div><p className="font-medium">{b.name}</p><p className="text-xs text-muted-foreground">{b.country}</p></div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openBrandEdit(b)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete {b.name}?</AlertDialogTitle><AlertDialogDescription>All phones under this brand will remain.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteBrand(b.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Comments */}
        <TabsContent value="comments">
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="glass rounded-xl p-4 flex justify-between items-start">
                <div>
                  <p className="text-sm"><span className="font-medium">{c.userName}</span> on <span className="text-primary">{phones.find((p) => p.id === c.phoneId)?.name}</span></p>
                  <p className="text-sm mt-1">{c.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => { deleteComment(c.id); toast({ title: "Comment deleted" }); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-muted-foreground py-8">No comments yet</p>}
          </div>
        </TabsContent>
      </Tabs>

      {/* Phone Dialog */}
      <Dialog open={phoneDialog} onOpenChange={setPhoneDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPhone ? "Edit Phone" : "Add Phone"}</DialogTitle>
            <DialogDescription>Fill in the phone details below</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Name</Label><Input value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} /></div>
            <div><Label className="text-xs">Tagline</Label><Input value={pForm.tagline} onChange={(e) => setPForm({ ...pForm, tagline: e.target.value })} /></div>
            <div>
              <Label className="text-xs">Brand</Label>
              <Select value={pForm.brandId} onValueChange={(v) => setPForm({ ...pForm, brandId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Price ($)</Label><Input type="number" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Release Date</Label><Input type="date" value={pForm.releaseDate} onChange={(e) => setPForm({ ...pForm, releaseDate: e.target.value })} /></div>
            <div><Label className="text-xs">YouTube ID</Label><Input value={pForm.youtubeReviewId} onChange={(e) => setPForm({ ...pForm, youtubeReviewId: e.target.value })} /></div>

            <div className="col-span-2 border-t border-border pt-2 mt-2"><p className="text-sm font-semibold">Specs</p></div>
            {(["display","displaySize","resolution","refreshRate","cpu","gpu","ram","storage","mainCamera","selfieCamera","battery","charging","os","weight","dimensions","waterResistance","connectivity"] as const).map((key) => (
              <div key={key}><Label className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</Label><Input value={(pForm as any)[key]} onChange={(e) => setPForm({ ...pForm, [key]: e.target.value })} /></div>
            ))}

            <div className="col-span-2 border-t border-border pt-2 mt-2"><p className="text-sm font-semibold">Benchmarks</p></div>
            <div><Label className="text-xs">AnTuTu</Label><Input type="number" value={pForm.antutu} onChange={(e) => setPForm({ ...pForm, antutu: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Geekbench Single</Label><Input type="number" value={pForm.geekbenchSingle} onChange={(e) => setPForm({ ...pForm, geekbenchSingle: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">Geekbench Multi</Label><Input type="number" value={pForm.geekbenchMulti} onChange={(e) => setPForm({ ...pForm, geekbenchMulti: Number(e.target.value) })} /></div>
            <div><Label className="text-xs">GPU Score</Label><Input type="number" value={pForm.gpuScore} onChange={(e) => setPForm({ ...pForm, gpuScore: Number(e.target.value) })} /></div>

            <div className="col-span-2 border-t border-border pt-2 mt-2"><p className="text-sm font-semibold">Badges</p></div>
            <div className="flex items-center gap-2"><Checkbox checked={pForm.mostViewed} onCheckedChange={(v) => setPForm({ ...pForm, mostViewed: !!v })} /><Label className="text-xs">Most Viewed</Label></div>
            <div className="flex items-center gap-2"><Checkbox checked={pForm.mostLiked} onCheckedChange={(v) => setPForm({ ...pForm, mostLiked: !!v })} /><Label className="text-xs">Most Liked</Label></div>
            <div className="flex items-center gap-2"><Checkbox checked={pForm.bestValue} onCheckedChange={(v) => setPForm({ ...pForm, bestValue: !!v })} /><Label className="text-xs">Best Value</Label></div>

            <div className="col-span-2"><Label className="text-xs">Tips & Tricks (one per line)</Label><Textarea value={pForm.tips} onChange={(e) => setPForm({ ...pForm, tips: e.target.value })} rows={4} /></div>
          </div>
          <DialogFooter><Button onClick={savePhone} className="gradient-primary text-primary-foreground">{editingPhone ? "Save Changes" : "Add Phone"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={brandDialog} onOpenChange={setBrandDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
            <DialogDescription>Fill in the brand details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={bForm.name} onChange={(e) => setBForm({ ...bForm, name: e.target.value })} /></div>
            <div><Label>Logo (emoji)</Label><Input value={bForm.logo} onChange={(e) => setBForm({ ...bForm, logo: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={bForm.description} onChange={(e) => setBForm({ ...bForm, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Founded</Label><Input type="number" value={bForm.founded} onChange={(e) => setBForm({ ...bForm, founded: Number(e.target.value) })} /></div>
              <div><Label>Country</Label><Input value={bForm.country} onChange={(e) => setBForm({ ...bForm, country: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={saveBrand} className="gradient-primary text-primary-foreground">{editingBrand ? "Save Changes" : "Add Brand"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
