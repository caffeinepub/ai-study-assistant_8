import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Brain, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExamType, type UserProfile } from "../backend";
import { useSaveProfile } from "../hooks/useQueries";

const EXAM_OPTIONS = [
  {
    value: ExamType.class10,
    label: "Class 10",
    desc: "CBSE / State Board",
    icon: "📚",
  },
  {
    value: ExamType.class12,
    label: "Class 12",
    desc: "CBSE / State Board",
    icon: "🎓",
  },
  { value: ExamType.jee, label: "JEE", desc: "Joint Entrance Exam", icon: "⚙️" },
  { value: ExamType.neet, label: "NEET", desc: "Medical Entrance", icon: "🩺" },
  { value: ExamType.upsc, label: "UPSC", desc: "Civil Services", icon: "🏛️" },
];

const SUBJECTS_MAP: Record<ExamType, string[]> = {
  [ExamType.class10]: [
    "Mathematics",
    "Science",
    "Social Studies",
    "English",
    "Hindi",
  ],
  [ExamType.class12]: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Economics",
  ],
  [ExamType.jee]: ["Physics", "Chemistry", "Mathematics"],
  [ExamType.neet]: ["Physics", "Chemistry", "Biology", "Botany", "Zoology"],
  [ExamType.upsc]: [
    "History",
    "Geography",
    "Polity",
    "Economics",
    "Science & Tech",
    "Environment",
  ],
};

const FEATURES = [
  { icon: <Zap className="w-4 h-4" />, text: "AI-powered doubt solving" },
  { icon: <BookOpen className="w-4 h-4" />, text: "Smart notes & quizzes" },
  { icon: <Brain className="w-4 h-4" />, text: "Track your progress" },
];

interface Props {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [exam, setExam] = useState<ExamType | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const saveProfile = useSaveProfile();

  const toggleSubject = (s: string) =>
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleFinish = async () => {
    if (!exam || subjects.length === 0) return;
    const profile: UserProfile = {
      name: name.trim(),
      examType: exam,
      subjects,
    };
    try {
      await saveProfile.mutateAsync(profile);
      localStorage.setItem("onboarding_done", "1");
      localStorage.setItem("user_name", name.trim());
      localStorage.setItem("user_exam", exam);
      toast.success("Welcome aboard! 🎉");
      onComplete();
    } catch {
      localStorage.setItem("onboarding_done", "1");
      localStorage.setItem("user_name", name.trim());
      localStorage.setItem("user_exam", exam);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background geo-bg flex flex-col items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="text-center"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-orange">
                  <Brain className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                AI Study <span className="text-primary">Assistant</span>
              </h1>
              <p className="text-muted-foreground mb-2">
                Your AI-Powered Study Partner
              </p>
              <p className="text-sm text-muted-foreground mb-10">
                Personalized for Indian students. Smart, fast, and effective.
              </p>
              <div className="space-y-3 mb-10">
                {FEATURES.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-xs"
                  >
                    <span className="text-primary">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                data-ocid="onboarding.primary_button"
                className="w-full bg-primary text-primary-foreground font-semibold py-6 rounded-2xl shadow-orange hover:bg-primary/90 text-base"
                onClick={() => setStep(1)}
              >
                Get Started →
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="name"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Step 1 of 3
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">What's your name?</h2>
              <p className="text-muted-foreground mb-8">
                We'll personalize your experience.
              </p>
              <Input
                data-ocid="onboarding.input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg py-6 rounded-2xl border-border bg-card mb-6"
                autoFocus
              />
              <Button
                data-ocid="onboarding.primary_button"
                className="w-full bg-primary text-primary-foreground font-semibold py-6 rounded-2xl shadow-orange hover:bg-primary/90 text-base"
                disabled={name.trim().length < 2}
                onClick={() => setStep(2)}
              >
                Continue →
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="exam"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Step 2 of 3
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Which exam?</h2>
              <p className="text-muted-foreground mb-6">
                Choose your target exam.
              </p>
              <div className="space-y-3 mb-6">
                {EXAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    data-ocid={`onboarding.${opt.value}.button`}
                    onClick={() => setExam(opt.value)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
                      exam === opt.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <div className="font-bold text-foreground">
                        {opt.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {opt.desc}
                      </div>
                    </div>
                    {exam === opt.value && (
                      <span className="ml-auto text-primary font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 py-6 rounded-2xl"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  data-ocid="onboarding.primary_button"
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-6 rounded-2xl shadow-orange hover:bg-primary/90"
                  disabled={!exam}
                  onClick={() => setStep(3)}
                >
                  Continue →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && exam && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
            >
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Step 3 of 3
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Your subjects</h2>
              <p className="text-muted-foreground mb-6">
                Select subjects you want to study.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {SUBJECTS_MAP[exam].map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-ocid="onboarding.subject.button"
                    onClick={() => toggleSubject(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      subjects.includes(s)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 py-6 rounded-2xl"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  data-ocid="onboarding.submit_button"
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-6 rounded-2xl shadow-orange hover:bg-primary/90"
                  disabled={subjects.length === 0 || saveProfile.isPending}
                  onClick={handleFinish}
                >
                  {saveProfile.isPending ? "Saving..." : "Get Started! 🚀"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
