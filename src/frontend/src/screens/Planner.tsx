import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddStudySession } from "../hooks/useQueries";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English",
];

interface Task {
  id: string;
  title: string;
  subject: string;
  duration: number;
  day: string;
  done: boolean;
}

const SAMPLE_PLAN: Task[] = [
  {
    id: "s1",
    title: "Algebra — Quadratic Equations",
    subject: "Mathematics",
    duration: 60,
    day: "Mon",
    done: false,
  },
  {
    id: "s2",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    duration: 45,
    day: "Mon",
    done: false,
  },
  {
    id: "s3",
    title: "Organic Chemistry — Hydrocarbons",
    subject: "Chemistry",
    duration: 50,
    day: "Tue",
    done: false,
  },
  {
    id: "s4",
    title: "Cell Biology Revision",
    subject: "Biology",
    duration: 40,
    day: "Tue",
    done: false,
  },
  {
    id: "s5",
    title: "Freedom Struggle — 1857 to 1947",
    subject: "History",
    duration: 45,
    day: "Wed",
    done: false,
  },
  {
    id: "s6",
    title: "River Systems in India",
    subject: "Geography",
    duration: 35,
    day: "Wed",
    done: false,
  },
  {
    id: "s7",
    title: "Calculus — Derivatives",
    subject: "Mathematics",
    duration: 75,
    day: "Thu",
    done: false,
  },
  {
    id: "s8",
    title: "Electrostatics",
    subject: "Physics",
    duration: 60,
    day: "Thu",
    done: false,
  },
  {
    id: "s9",
    title: "Grammar — Active and Passive Voice",
    subject: "English",
    duration: 30,
    day: "Fri",
    done: false,
  },
  {
    id: "s10",
    title: "Thermodynamics",
    subject: "Chemistry",
    duration: 55,
    day: "Fri",
    done: false,
  },
  {
    id: "s11",
    title: "Mock Test — Full Syllabus",
    subject: "Mathematics",
    duration: 120,
    day: "Sat",
    done: false,
  },
  {
    id: "s12",
    title: "Weekly Revision",
    subject: "Biology",
    duration: 60,
    day: "Sun",
    done: false,
  },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-50 text-blue-600",
  Physics: "bg-purple-50 text-purple-600",
  Chemistry: "bg-green-50 text-green-600",
  Biology: "bg-emerald-50 text-emerald-600",
  History: "bg-amber-50 text-amber-600",
  Geography: "bg-teal-50 text-teal-600",
  English: "bg-rose-50 text-rose-600",
};

export default function Planner() {
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const [selectedDay, setSelectedDay] = useState(DAYS[todayIdx]);
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_PLAN);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [duration, setDuration] = useState("30");
  const [savingId, setSavingId] = useState<string | null>(null);
  const addSession = useAddStudySession();

  const dayTasks = tasks.filter((t) => t.day === selectedDay);
  const totalDayMinutes = dayTasks.reduce((s, t) => s + t.duration, 0);
  const doneTasks = dayTasks.filter((t) => t.done).length;

  const addTask = () => {
    if (!title.trim()) {
      toast.error("Enter a task title");
      return;
    }
    const d = Number.parseInt(duration, 10);
    if (Number.isNaN(d) || d <= 0) {
      toast.error("Enter valid duration");
      return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      subject,
      duration: d,
      day: selectedDay,
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDuration("30");
    toast.success("Task added!");
  };

  const toggleDone = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
    );
    if (!task.done) {
      setSavingId(task.id);
      try {
        await addSession.mutateAsync({
          subject: task.subject,
          durationMinutes: BigInt(task.duration),
          date: BigInt(Date.now()),
        });
        toast.success(`✅ ${task.subject} session saved!`);
      } catch {
        toast.error("Could not save session");
      } finally {
        setSavingId(null);
      }
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task removed");
  };

  const generatePlan = () => {
    setTasks(SAMPLE_PLAN.map((t) => ({ ...t, done: false })));
    toast.success("Weekly plan generated! 🗓️");
  };

  return (
    <div className="pb-4">
      <div className="bg-primary px-5 pt-14 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-primary-foreground mb-1">
          Study Planner
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          Plan smart, study better.
        </p>
      </div>

      <div className="px-4 pt-4">
        {/* Day Selector */}
        <div
          className="flex gap-2 overflow-x-auto pb-1 mb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {DAYS.map((d, i) => {
            const isToday = i === todayIdx;
            const isSelected = d === selectedDay;
            return (
              <button
                key={d}
                type="button"
                data-ocid="planner.day.tab"
                onClick={() => setSelectedDay(d)}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-colors min-w-[48px] ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground"
                }`}
              >
                <span className="text-[10px] font-semibold mb-0.5">{d}</span>
                {isToday && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Day Stats */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-card rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                {totalDayMinutes} min
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Planned time</p>
          </div>
          <div className="flex-1 bg-card rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-foreground">
                {doneTasks}/{dayTasks.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <button
            type="button"
            data-ocid="planner.generate.button"
            onClick={generatePlan}
            className="flex-1 bg-orange-50 rounded-xl p-3 shadow-xs flex flex-col items-center justify-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">
              AI Plan
            </span>
          </button>
        </div>

        {/* Add Task */}
        <div className="bg-card rounded-2xl p-4 shadow-xs mb-4">
          <h3 className="text-sm font-bold text-foreground mb-3">
            Add Task — {selectedDay}
          </h3>
          <Input
            data-ocid="planner.task.input"
            placeholder="e.g. Revise Quadratic Equations"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="mb-2"
          />
          <div className="flex gap-2 mb-3">
            <select
              data-ocid="planner.subject.select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 h-9 rounded-lg border border-input bg-background px-2 text-sm"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Input
              data-ocid="planner.duration.input"
              type="number"
              placeholder="Min"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-20"
            />
          </div>
          <Button
            data-ocid="planner.add.primary_button"
            className="w-full h-9 rounded-lg font-semibold text-sm"
            onClick={addTask}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Task
          </Button>
        </div>

        {/* Task List */}
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {selectedDay}'s Schedule
        </h3>
        {dayTasks.length === 0 ? (
          <div
            data-ocid="planner.tasks.empty_state"
            className="bg-card rounded-2xl p-8 text-center"
          >
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No tasks for {selectedDay}. Add one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task, i) => (
              <div
                key={task.id}
                data-ocid={`planner.task.item.${i + 1}`}
                className={`bg-card rounded-2xl p-4 shadow-xs flex items-center gap-3 transition-opacity ${
                  task.done ? "opacity-60" : ""
                }`}
              >
                <button
                  type="button"
                  data-ocid={`planner.task.checkbox.${i + 1}`}
                  onClick={() => toggleDone(task)}
                  disabled={savingId === task.id}
                  className="flex-shrink-0"
                >
                  {task.done ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm truncate ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${SUBJECT_COLORS[task.subject] || "bg-secondary text-foreground"}`}
                    >
                      {task.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {task.duration} min
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  data-ocid={`planner.task.delete_button.${i + 1}`}
                  onClick={() => deleteTask(task.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
