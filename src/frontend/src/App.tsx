import { Toaster } from "@/components/ui/sonner";
import {
  BarChart2,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  ListChecks,
  LogIn,
  LogOut,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import Chat from "./screens/Chat";
import Dashboard from "./screens/Dashboard";
import Notes from "./screens/Notes";
import Onboarding from "./screens/Onboarding";
import Planner from "./screens/Planner";
import Progress from "./screens/Progress";
import Quiz from "./screens/Quiz";
import Scanner from "./screens/Scanner";

const TABS = [
  { id: "home", label: "Dashboard", icon: Home },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "planner", label: "Planner", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: BarChart2 },
  { id: "scanner", label: "AI Scanner", icon: ScanLine },
];

const BOTTOM_TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "quiz", label: "Quiz", icon: ListChecks },
  { id: "planner", label: "Plan", icon: CalendarDays },
  { id: "progress", label: "Progress", icon: BarChart2 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [onboarded, setOnboarded] = useState(
    () => !!localStorage.getItem("onboarding_done"),
  );
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  useEffect(() => {
    setOnboarded(!!localStorage.getItem("onboarding_done"));
  }, []);

  if (!onboarded) {
    return (
      <>
        <Onboarding onComplete={() => setOnboarded(true)} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        data-ocid="app.sidebar.panel"
        className="hidden lg:flex flex-col w-64 bg-card border-r border-border min-h-screen fixed top-0 left-0 z-20"
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-base leading-tight">
                StudyAI
              </h1>
              <p className="text-xs text-muted-foreground">
                Smart Learning Platform
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-ocid={`app.${tab.id}.link`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User / Auth */}
        <div className="px-4 py-4 border-t border-border">
          {isInitializing ? null : isLoggedIn ? (
            <button
              type="button"
              data-ocid="app.logout.button"
              onClick={clear}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <button
              type="button"
              data-ocid="app.login.button"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Connecting..." : "Login with II"}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile Auth Bar */}
        <div className="lg:hidden absolute top-4 right-4 z-20">
          {isInitializing ? null : isLoggedIn ? (
            <button
              type="button"
              data-ocid="app.mobile.logout.button"
              onClick={clear}
              className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          ) : (
            <button
              type="button"
              data-ocid="app.mobile.login.button"
              onClick={login}
              disabled={isLoggingIn}
              className="flex items-center gap-1.5 bg-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-orange"
            >
              <LogIn className="w-3 h-3" />
              {isLoggingIn ? "Connecting..." : "Login"}
            </button>
          )}
        </div>

        {/* Screen */}
        <main
          className="flex-1 overflow-y-auto pb-24 lg:pb-6 lg:max-w-3xl lg:mx-auto lg:w-full"
          style={{ scrollbarWidth: "none" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {activeTab === "home" && <Dashboard onTabChange={setActiveTab} />}
              {activeTab === "chat" && <Chat />}
              {activeTab === "scanner" && <Scanner />}
              {activeTab === "notes" && <Notes />}
              {activeTab === "quiz" && <Quiz />}
              {activeTab === "planner" && <Planner />}
              {activeTab === "progress" && <Progress />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav
          data-ocid="app.nav.panel"
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-10"
          style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center justify-around px-2 py-2">
            {BOTTOM_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-ocid={`app.${tab.id}.tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors"
                >
                  <tab.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
