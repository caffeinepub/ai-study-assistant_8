import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  BookOpen,
  Clock,
  Flame,
  MessageCircle,
  ScanLine,
  Trophy,
} from "lucide-react";
import {
  useStats,
  useStudySessions,
  useUserProfile,
} from "../hooks/useQueries";

interface Props {
  onTabChange: (tab: string) => void;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const FEATURE_CARDS = [
  {
    id: "chat",
    icon: MessageCircle,
    label: "AI Chat",
    desc: "Ask any doubt",
    tab: "chat",
    color: "bg-orange-100 text-orange-500",
  },
  {
    id: "scanner",
    icon: ScanLine,
    label: "AI Scanner",
    desc: "Scan questions",
    tab: "scanner",
    color: "bg-blue-50 text-blue-500",
  },
  {
    id: "notes",
    icon: BookOpen,
    label: "My Notes",
    desc: "Study notes",
    tab: "notes",
    color: "bg-green-50 text-green-600",
  },
  {
    id: "progress",
    icon: Trophy,
    label: "Progress",
    desc: "Track scores",
    tab: "progress",
    color: "bg-purple-50 text-purple-500",
  },
];

const STAT_DEFS = [
  { key: "streak", icon: Flame, label: "Streak", color: "text-orange-500" },
  { key: "notes", icon: BookOpen, label: "Notes", color: "text-green-600" },
  { key: "score", icon: Trophy, label: "Avg Score", color: "text-purple-500" },
];

const EXAM_LABELS: Record<string, string> = {
  jee: "JEE 2026",
  neet: "NEET 2026",
  upsc: "UPSC 2026",
  class10: "Class 10",
  class12: "Class 12",
};

export default function Dashboard({ onTabChange }: Props) {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: sessions } = useStudySessions();
  const name = profile?.name || localStorage.getItem("user_name") || "Student";
  const examKey =
    profile?.examType || localStorage.getItem("user_exam") || "jee";

  const recentSessions = (sessions || []).slice(-3).reverse();

  const statValues = [
    statsLoading ? "—" : "7 days",
    statsLoading ? "—" : String(stats?.notesCount ?? 0),
    statsLoading ? "—" : `${stats?.avgScore ?? 0}%`,
  ];

  return (
    <div className="pb-4">
      <div className="bg-primary px-5 pt-14 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/80 text-sm mb-1">
          {getGreeting()} 👋
        </p>
        {profileLoading ? (
          <Skeleton className="h-8 w-40 bg-primary-foreground/20 mb-2" />
        ) : (
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            {name}!
          </h1>
        )}
        <span className="inline-block bg-primary-foreground/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          🎯 {EXAM_LABELS[examKey as string] || "Student"}
        </span>
      </div>

      <div className="px-5 -mt-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STAT_DEFS.map((s, i) => (
            <div
              key={s.key}
              className="bg-card rounded-2xl p-3 shadow-xs text-center"
            >
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              {statsLoading ? (
                <Skeleton className="h-5 w-12 mx-auto mb-1" />
              ) : (
                <div className="font-bold text-foreground text-sm">
                  {statValues[i]}
                </div>
              )}
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <h2 className="text-base font-bold text-foreground mb-3">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {FEATURE_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              data-ocid={`dashboard.${card.id}.button`}
              onClick={() => onTabChange(card.tab)}
              className="bg-card rounded-2xl p-4 shadow-xs text-left hover:shadow-card transition-shadow active:scale-95"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div className="font-bold text-foreground text-sm">
                {card.label}
              </div>
              <div className="text-xs text-muted-foreground">{card.desc}</div>
            </button>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-foreground">
            Recent Sessions
          </h2>
          <button
            type="button"
            data-ocid="dashboard.progress.link"
            onClick={() => onTabChange("progress")}
            className="text-xs text-primary font-semibold"
          >
            View all
          </button>
        </div>
        <div className="space-y-2">
          {recentSessions.length === 0 ? (
            <div
              data-ocid="dashboard.sessions.empty_state"
              className="bg-card rounded-2xl p-6 text-center"
            >
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No sessions yet. Start studying! 📖
              </p>
            </div>
          ) : (
            recentSessions.map((s, i) => (
              <div
                key={s.subject + String(s.date)}
                data-ocid={`dashboard.session.item.${i + 1}`}
                className="bg-card rounded-2xl px-4 py-3 shadow-xs flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm truncate">
                    {s.subject}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Number(s.durationMinutes)} min
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
