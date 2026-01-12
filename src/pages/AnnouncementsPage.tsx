import { useState } from "react";
import { useSchool } from "@/contexts/SchoolContext";
import { Announcement } from "@/types/school";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";

export function AnnouncementsPage() {
  const { data, isLoading, addAnnouncement, updateAnnouncement, removeAnnouncement } = useSchool();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });

  if (isLoading || !data) return <div className="flex h-64 items-center justify-center"><div className="text-muted-foreground">Yuklanmoqda...</div></div>;

  const handleAdd = () => {
    if (!formData.title || !formData.content) { toast({ title: "Xatolik", description: "Barcha maydonlarni to'ldiring", variant: "destructive" }); return; }
    addAnnouncement({ id: Date.now().toString(), title: formData.title, content: formData.content, date: new Date().toISOString().split("T")[0] });
    setIsAddOpen(false);
    setFormData({ title: "", content: "" });
    toast({ title: "E'lon qo'shildi" });
  };

  const handleEdit = () => {
    if (!editingId) return;
    updateAnnouncement(editingId, { title: formData.title, content: formData.content });
    setEditingId(null);
    toast({ title: "E'lon yangilandi" });
  };

  const handleRemove = (id: string) => {
    if (confirm("E'lonni o'chirmoqchimisiz?")) { removeAnnouncement(id); toast({ title: "E'lon o'chirildi", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">E'lonlar</h1><p className="mt-1 text-muted-foreground">Jami {data.announcements.length} ta e'lon</p></div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />E'lon qo'shish</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Yangi e'lon</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Sarlavha</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="E'lon sarlavhasi" /></div>
              <div><Label>Matn</Label><Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="E'lon matni..." rows={5} /></div>
              <Button onClick={handleAdd} className="w-full">Qo'shish</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {data.announcements.map((a) => (
          <div key={a.id} className="rounded-xl bg-card p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"><Megaphone className="h-6 w-6 text-primary" /></div>
                <div><h3 className="text-lg font-semibold">{a.title}</h3><p className="text-sm text-muted-foreground">{new Date(a.date).toLocaleDateString("uz-UZ")}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => { setEditingId(a.id); setFormData({ title: a.title, content: a.content }); }}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">{a.content}</p>
          </div>
        ))}
        {data.announcements.length === 0 && <p className="text-center text-muted-foreground py-12">Hozircha e'lonlar yo'q</p>}
      </div>
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>E'lonni tahrirlash</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Sarlavha</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label>Matn</Label><Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={5} /></div>
            <Button onClick={handleEdit} className="w-full">Saqlash</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
