import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Bookmark,
  Camera,
  History,
  Image,
  Mic,
  ScanLine,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAddChatMessage } from "../hooks/useQueries";

const SCAN_ANSWERS = [
  "Based on the scanned image, here's the solution:\n\n📐 This appears to be a quadratic equation.\nUsing the quadratic formula: x = (-b ± √(b²-4ac)) / 2a\n\nStep 1: Identify coefficients a, b, c\nStep 2: Calculate discriminant b²-4ac\nStep 3: Apply formula\n\n✅ The roots are real and distinct since discriminant > 0.",
  "Scanning complete! 🔍\n\nThis is a Physics diagram showing forces in equilibrium.\n\nKey observations:\n• Net force = 0 (object at rest)\n• Sum of all forces = 0\n• Using Lami's theorem for 3 concurrent forces\n\n✅ Solution: F₁sin(α) = F₂sin(β) = F₃sin(γ)",
  "I can see this question is about Chemical reactions.\n\n⚗️ This looks like a balancing equation problem.\n\nThe Law of Conservation of Mass states: atoms cannot be created or destroyed in a chemical reaction.\n\nMethod:\n1. Count atoms on each side\n2. Add coefficients to balance\n3. Verify the equation\n\n✅ Balanced equation found!",
];

const CORNER_GUIDES = [
  { key: "tl", cls: "top-3 left-3 border-t-2 border-l-2" },
  { key: "tr", cls: "top-3 right-3 border-t-2 border-r-2" },
  { key: "bl", cls: "bottom-3 left-3 border-b-2 border-l-2" },
  { key: "br", cls: "bottom-3 right-3 border-b-2 border-r-2" },
];

export default function Scanner() {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const addMessage = useAddChatMessage();

  const runScan = async () => {
    setIsScanning(true);
    setAnswer(null);
    setScanProgress(0);
    const steps = [15, 35, 55, 75, 90, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 400));
      setScanProgress(step);
    }
    setIsScanning(false);
    const result =
      SCAN_ANSWERS[Math.floor(Math.random() * SCAN_ANSWERS.length)];
    setAnswer(result);
    toast.success("Scan complete!");
    try {
      await addMessage.mutateAsync({
        question: "[Scanned Image]",
        answer: result,
      });
    } catch {
      /* silent */
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setScannedImage(url);
    runScan();
  };

  const handleCapture = () => {
    fileRef.current?.click();
  };

  const handleReset = () => {
    setScannedImage(null);
    setAnswer(null);
    setScanProgress(0);
    setIsScanning(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-background">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            data-ocid="scanner.back.button"
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="font-bold text-foreground text-lg">AI Scanner</h1>
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="scanner.history.button"
              className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shadow-xs"
            >
              <History className="w-4 h-4 text-foreground" />
            </button>
            <button
              type="button"
              data-ocid="scanner.bookmark.button"
              className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shadow-xs"
            >
              <Bookmark className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Scan Your <span className="text-primary">Question...</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Point at a problem to get instant AI answers
        </p>
      </div>

      <div className="px-5 flex-1">
        {/* Viewfinder */}
        <div
          className="relative rounded-3xl overflow-hidden bg-gray-900 border-2 border-gray-700 mb-4"
          style={{ height: 280 }}
        >
          {scannedImage ? (
            <img
              src={scannedImage}
              alt="Scanned"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Camera / Upload</p>
              </div>
            </div>
          )}
          {/* Corner guides */}
          {!scannedImage &&
            CORNER_GUIDES.map(({ key, cls }) => (
              <div
                key={key}
                className={`absolute w-6 h-6 border-primary ${cls}`}
              />
            ))}
          {/* Scanning line */}
          {(isScanning || !scannedImage) && (
            <div
              data-ocid="scanner.canvas_target"
              className="scan-line absolute left-0 right-0 h-1 bg-primary/60 rounded-full"
              style={{ boxShadow: "0 0 12px 4px rgba(255,107,43,0.4)" }}
            />
          )}
          {/* Overlay when scanning */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/20 flex items-end justify-center pb-4">
              <div className="bg-black/60 rounded-full px-4 py-1.5">
                <span className="text-white text-xs font-semibold">
                  Analyzing... {scanProgress}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {(isScanning || scanProgress > 0) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">
                Scan Progress
              </span>
              <span className="text-xs font-bold text-primary">
                {scanProgress}%
              </span>
            </div>
            <div data-ocid="scanner.loading_state">
              <Progress
                value={scanProgress}
                className="h-2 [&>div]:bg-primary"
              />
            </div>
          </div>
        )}

        {/* Answer */}
        {answer && (
          <div
            data-ocid="scanner.success_state"
            className="bg-card rounded-2xl p-4 shadow-xs mb-4 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <ScanLine className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">AI Answer</span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-line">
              {answer}
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-center gap-6 py-4">
          <button
            type="button"
            data-ocid="scanner.upload_button"
            onClick={() => fileRef.current?.click()}
            className="w-12 h-12 rounded-full bg-card border border-border shadow-xs flex items-center justify-center"
          >
            <Image className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            type="button"
            data-ocid="scanner.canvas_target"
            onClick={handleCapture}
            disabled={isScanning}
            className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-orange active:scale-95 transition-transform disabled:opacity-50"
          >
            <Camera className="w-8 h-8 text-primary-foreground" />
          </button>
          <button
            type="button"
            data-ocid="scanner.mic.button"
            className="w-12 h-12 rounded-full bg-card border border-border shadow-xs flex items-center justify-center"
            onClick={() => toast.info("Voice input coming soon!")}
          >
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
