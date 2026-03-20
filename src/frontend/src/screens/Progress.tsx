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
import {
  BarChart2,
  BookOpen,
  Clock,
  MessageCircle,
  Plus,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { StudySession } from "../backend";
import {
  useAddStudySession,
  useQuizAttempts,
  useStats,
  useStudySessions,
} from "../hooks/useQueries";

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
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STAT_DEFS = [
  {
    key: "sessions",
    icon: Clock,
    label: "Total Sessions",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    key: "quiz",
    icon: Trophy,
    label: "Avg Quiz Score",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    key: "notes",
    icon: BookOpen,
    label: "Notes Created",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    key: "chat",
    icon: MessageCircle,
    label: "Questions Asked",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

export default function Progress() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: quiz } = useQuizAttempts();
  const { data: sessions } = useStudySessions();
  const addSession = useAddStudySession();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", duration: "" });

  const recentQuiz = (quiz || []).slice(-5).reverse();

  const weekData = DAYS.map((day, i) => {
    const count = (sessions || []).filter((s) => {
      const d = new Date(Number(s.date) / 1_000_000);
      return d.getDay() === (i + 1) % 7;
    }).length;
    return { day, count };
  });
  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  const statValues = [
    String(stats?.totalSessions ?? 0),
    `${stats?.avgScore ?? 0}%`,
    String(stats?.notesCount ?? 0),
    String(stats?.chatCount ?? 0),
  ];

  const handleAddSession = async () => {
    if (!form.subject || !form.duration) return;
    const session: StudySession = {
      subject: form.subject,
      durationMinutes: BigInt(Number(form.duration)),
      date: BigInt(Date.now() * 1_000_000),
    };
    try {
      await addSession.mutateAsync(session);
      toast.success("Session added!");
      setForm({ subject: "", duration: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to save session");
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-primary px-5 pt-14 pb-6">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">
          My Progress
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          Track your learning journey
        </p>
      </div>

      <div className="px-5 py-4 flex-1">
        {statsLoading ? (
          <div
            data-ocid="progress.loading_state"
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {STAT_DEFS.map((s, i) => (
              <div
                key={s.key}
                data-ocid={`progress.stat.item.${i + 1}`}
                className="bg-card rounded-2xl p-4 shadow-xs"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-2`}
                >
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-xl font-bold text-foreground">
                  {statValues[i]}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Weekly Chart */}
        <div className="bg-card rounded-2xl p-4 shadow-xs mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground text-sm">
              Weekly Study Chart
            </h3>
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-2 h-20">
            {weekData.map((d) => (
              <div
                key={d.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden"
                  style={{
                    height: `${(d.count / maxCount) * 60 + 4}px`,
                    minHeight: 4,
                  }}
                >
                  {d.count > 0 && (
                    <div className="absolute inset-0 bg-primary rounded-t-lg" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-foreground text-sm">
            Recent Quiz Attempts
          </h3>
        </div>
        {recentQuiz.length === 0 ? (
          <div
            data-ocid="progress.quiz.empty_state"
            className="bg-card rounded-2xl p-6 text-center mb-4 shadow-xs"
          >
            <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No quiz attempts yet
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {recentQuiz.map((q, i) => (
              <div
                key={`${q.subject}-${q.topic}-${i}`}
                data-ocid={`progress.quiz.item.${i + 1}`}
                className="bg-card rounded-2xl px-4 py-3 shadow-xs flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">
                    {q.subject} — {q.topic}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Number(q.questionsAnswered)} questions
                  </div>
                </div>
                <div
                  className={`font-bold text-sm ${Number(q.score) >= 70 ? "text-green-600" : "text-destructive"}`}
                >
                  {Number(q.score)}%
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="progress.open_modal_button"
              className="w-full bg-primary text-primary-foreground rounded-2xl py-5 shadow-orange hover:bg-primary/90 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Study Session
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="progress.dialog"
            className="max-w-sm mx-4 rounded-3xl"
          >
            <DialogHeader>
              <DialogTitle>Add Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  Subject
                </Label>
                <Select
                  value={form.subject}
                  onValueChange={(v) => setForm({ ...form, subject: v })}
                >
                  <SelectTrigger
                    data-ocid="progress.select"
                    className="rounded-xl"
                  >
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
                  Duration (minutes)
                </Label>
                <Input
                  data-ocid="progress.input"
                  type="number"
                  placeholder="e.g. 45"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="rounded-xl"
                  min="1"
                  max="480"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setOpen(false)}
                  data-ocid="progress.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="progress.submit_button"
                  className="flex-1 bg-primary text-primary-foreground rounded-xl shadow-orange hover:bg-primary/90"
                  disabled={
                    !form.subject || !form.duration || addSession.isPending
                  }
                  onClick={handleAddSession}
                >
                  {addSession.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
