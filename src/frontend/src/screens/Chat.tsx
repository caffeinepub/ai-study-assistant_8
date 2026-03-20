import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAddChatMessage, useChatHistory } from "../hooks/useQueries";

function generateAIResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("newton") || q.includes("force") || q.includes("motion"))
    return "Newton's Laws of Motion:\n\n1st Law: An object stays at rest or in uniform motion unless acted upon by an external force.\n\n2nd Law: F = ma (Force = Mass × Acceleration)\n\n3rd Law: For every action, there's an equal and opposite reaction.\n\nWould you like a specific example or problem solved?";
  if (q.includes("photosynthesis"))
    return "Photosynthesis is the process by which plants make food using sunlight:\n\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nIt occurs in chloroplasts. The green pigment chlorophyll absorbs sunlight primarily.\n\nTwo stages: Light reactions (in thylakoid) and Calvin cycle (in stroma).";
  if (q.includes("quadratic") || q.includes("equation"))
    return "For a quadratic equation ax² + bx + c = 0, the solutions are:\n\nx = (-b ± √(b²-4ac)) / 2a\n\nThe discriminant (b²-4ac):\n• > 0: Two real roots\n• = 0: One repeated root\n• < 0: No real roots (complex)\n\nWant me to solve a specific quadratic?";
  if (q.includes("cell") || q.includes("mitosis"))
    return "Cell division (Mitosis) has 4 stages:\n\n1. Prophase: Chromatin condenses into chromosomes\n2. Metaphase: Chromosomes align at the equatorial plate\n3. Anaphase: Sister chromatids separate and move to poles\n4. Telophase: Nuclear envelope reforms\n\nResult: 2 identical daughter cells with same chromosome number.";
  if (
    q.includes("integration") ||
    q.includes("differentiation") ||
    q.includes("calculus")
  )
    return "Key Calculus Formulas:\n\nDifferentiation:\n• d/dx(xⁿ) = nxⁿ⁻¹\n• d/dx(sin x) = cos x\n• d/dx(eˣ) = eˣ\n\nIntegration:\n• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C\n• ∫sin x dx = -cos x + C\n• ∫eˣ dx = eˣ + C\n\nNeed help with a specific problem?";
  if (
    q.includes("india") ||
    q.includes("independence") ||
    q.includes("history")
  )
    return "Indian Independence Movement Key Events:\n\n• 1857: First War of Independence (Sepoy Mutiny)\n• 1885: Indian National Congress founded\n• 1915: Gandhi returns to India\n• 1919: Jallianwala Bagh massacre\n• 1930: Dandi March (Salt Satyagraha)\n• 1942: Quit India Movement\n• 15 Aug 1947: Independence achieved\n\nWould you like details on any specific event?";
  return `Great question! Here's my explanation:\n\nFor your query about "${question}", let me break it down:\n\n✅ This is an important topic for your exam preparation.\n\n📚 Key concepts to remember:\n• Start with the fundamental definitions\n• Understand the underlying principles\n• Practice problems regularly\n• Connect concepts with real-world examples\n\n💡 Study Tip: Make flashcards for formulas and key terms. Spaced repetition helps retention by up to 80%!\n\nAsk me for specific formulas, examples, or solved problems!`;
}

let msgIdCounter = 0;
function nextId() {
  return `m${++msgIdCounter}`;
}

type Message = { id: string; role: "user" | "ai"; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m0",
    role: "ai",
    text: "Hello! 👋 I'm your AI Study Assistant. Ask me anything about your subjects — Physics, Chemistry, Math, Biology, History, and more! 🎓",
  },
];

function scrollToBottom(el: HTMLDivElement | null) {
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] =
    useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: history, isLoading } = useChatHistory();
  const addMessage = useAddChatMessage();

  useEffect(() => {
    if (history && history.length > 0 && !historyLoaded) {
      setHistoryLoaded(true);
      const loaded = history.flatMap((m) => [
        { id: nextId(), role: "user" as const, text: m.question },
        { id: nextId(), role: "ai" as const, text: m.answer },
      ]);
      setLocalMessages([INITIAL_MESSAGES[0], ...loaded]);
      scrollToBottom(bottomRef.current);
    }
  }, [history, historyLoaded]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;
    setInput("");
    setLocalMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: q },
    ]);
    scrollToBottom(bottomRef.current);
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const answer = generateAIResponse(q);
    setIsTyping(false);
    setLocalMessages((prev) => [
      ...prev,
      { id: nextId(), role: "ai", text: answer },
    ]);
    scrollToBottom(bottomRef.current);
    try {
      await addMessage.mutateAsync({ question: q, answer });
    } catch {
      /* silent */
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-primary-foreground text-lg">
              AI Doubt Solver
            </h1>
            <p className="text-primary-foreground/70 text-xs">
              Always ready to help 🟢
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isLoading && (
          <div data-ocid="chat.loading_state" className="space-y-3">
            <Skeleton className="h-16 w-3/4 rounded-2xl" />
            <Skeleton className="h-12 w-1/2 rounded-2xl ml-auto" />
          </div>
        )}
        {localMessages.map((msg, i) => (
          <div
            key={msg.id}
            data-ocid={`chat.message.item.${i + 1}`}
            className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card text-foreground rounded-tl-sm shadow-xs"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div data-ocid="chat.typing.loading_state" className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary dot-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary dot-bounce" />
              <span className="w-2 h-2 rounded-full bg-primary dot-bounce" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-4 pt-2 bg-background border-t border-border">
        <div className="flex gap-2 items-center">
          <Input
            data-ocid="chat.input"
            placeholder="Ask your doubt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 rounded-xl border-border bg-card py-5"
          />
          <Button
            data-ocid="chat.submit_button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-primary p-0 shadow-orange hover:bg-primary/90"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
