import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Note } from "../backend";
import { useAddNote, useDeleteNote, useNotes } from "../hooks/useQueries";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English",
  "Economics",
];
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-50 text-blue-600",
  Physics: "bg-purple-50 text-purple-600",
  Chemistry: "bg-green-50 text-green-600",
  Biology: "bg-teal-50 text-teal-600",
  History: "bg-amber-50 text-amber-600",
  Geography: "bg-orange-50 text-orange-600",
  English: "bg-pink-50 text-pink-600",
  Economics: "bg-indigo-50 text-indigo-600",
};

export default function Notes() {
  const { data: notes, isLoading } = useNotes();
  const addNote = useAddNote();
  const deleteNote = useDeleteNote();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Note>({
    title: "",
    subject: "",
    topic: "",
    content: "",
  });

  const filtered = (notes || []).filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.topic.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async () => {
    if (!form.title || !form.subject) return;
    try {
      await addNote.mutateAsync(form);
      toast.success("Note saved!");
      setForm({ title: "", subject: "", topic: "", content: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDelete = async (title: string) => {
    try {
      await deleteNote.mutateAsync(title);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-primary px-5 pt-14 pb-6">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">
          My Notes
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          Your study material, organized
        </p>
      </div>

      <div className="px-5 py-4 flex-1">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="notes.search_input"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card rounded-xl border-border"
          />
        </div>

        {isLoading && (
          <div data-ocid="notes.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div data-ocid="notes.empty_state" className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">No notes yet</p>
            <p className="text-sm text-muted-foreground">
              Tap + to create your first note
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((note, i) => (
            <div
              key={note.title}
              data-ocid={`notes.item.${i + 1}`}
              className="bg-card rounded-2xl p-4 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">
                    {note.title}
                  </h3>
                  {note.topic && (
                    <p className="text-xs text-muted-foreground">
                      {note.topic}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid={`notes.delete_button.${i + 1}`}
                  onClick={() => handleDelete(note.title)}
                  disabled={deleteNote.isPending}
                  className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full mr-2 ${SUBJECT_COLORS[note.subject] || "bg-muted text-muted-foreground"}`}
              >
                {note.subject}
              </span>
              {note.content && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {note.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            data-ocid="notes.open_modal_button"
            className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary shadow-orange flex items-center justify-center z-10"
          >
            <Plus className="w-6 h-6 text-primary-foreground" />
          </button>
        </DialogTrigger>
        <DialogContent
          data-ocid="notes.dialog"
          className="max-w-sm mx-4 rounded-3xl"
        >
          <DialogHeader>
            <DialogTitle>New Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Title
              </Label>
              <Input
                data-ocid="notes.input"
                placeholder="Note title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Subject
              </Label>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm({ ...form, subject: v })}
              >
                <SelectTrigger data-ocid="notes.select" className="rounded-xl">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Topic
              </Label>
              <Input
                placeholder="Topic (optional)"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Content
              </Label>
              <Textarea
                data-ocid="notes.textarea"
                placeholder="Write your notes here..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl min-h-24"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setOpen(false)}
                data-ocid="notes.cancel_button"
              >
                Cancel
              </Button>
              <Button
                data-ocid="notes.submit_button"
                className="flex-1 bg-primary text-primary-foreground rounded-xl shadow-orange hover:bg-primary/90"
                disabled={!form.title || !form.subject || addNote.isPending}
                onClick={handleSave}
              >
                {addNote.isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
