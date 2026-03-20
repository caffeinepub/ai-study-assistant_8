import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  ChevronRight,
  ListChecks,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddQuizAttempt, useQuizAttempts } from "../hooks/useQueries";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "English",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTION_BANK: Record<string, Record<Difficulty, Question[]>> = {
  Mathematics: {
    Easy: [
      {
        question: "What is the value of √144?",
        options: ["10", "11", "12", "13"],
        correct: 2,
        explanation: "12 × 12 = 144, so √144 = 12",
      },
      {
        question: "If 2x + 5 = 15, what is x?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "2x = 10, x = 5",
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct: 1,
        explanation: "15/100 × 200 = 30",
      },
      {
        question: "The perimeter of a square with side 7 cm is:",
        options: ["14 cm", "21 cm", "28 cm", "49 cm"],
        correct: 2,
        explanation: "Perimeter = 4 × side = 4 × 7 = 28 cm",
      },
      {
        question: "What is the LCM of 4 and 6?",
        options: ["8", "10", "12", "24"],
        correct: 2,
        explanation: "LCM(4,6) = 12",
      },
    ],
    Medium: [
      {
        question: "The roots of x² − 5x + 6 = 0 are:",
        options: ["2, 3", "1, 6", "−2, −3", "−1, −6"],
        correct: 0,
        explanation: "(x−2)(x−3) = 0, roots are 2 and 3",
      },
      {
        question: "If sin θ = 3/5, find cos θ (first quadrant):",
        options: ["4/5", "3/4", "5/4", "1/2"],
        correct: 0,
        explanation: "cos θ = √(1 − 9/25) = √(16/25) = 4/5",
      },
      {
        question: "The slope of the line 3x − 4y + 8 = 0 is:",
        options: ["3/4", "−3/4", "4/3", "−4/3"],
        correct: 0,
        explanation: "Rearranging: y = 3x/4 + 2, slope = 3/4",
      },
      {
        question: "Sum of first 10 natural numbers:",
        options: ["45", "50", "55", "60"],
        correct: 2,
        explanation: "n(n+1)/2 = 10 × 11/2 = 55",
      },
      {
        question: "If A = {1,2,3} and B = {2,3,4}, then A ∩ B is:",
        options: ["{1}", "{2,3}", "{1,2,3,4}", "{4}"],
        correct: 1,
        explanation: "A ∩ B contains elements common to both sets: {2,3}",
      },
    ],
    Hard: [
      {
        question: "The value of lim(x→0) [sin x / x] is:",
        options: ["0", "∞", "1", "−1"],
        correct: 2,
        explanation: "This is a standard limit: lim(x→0) sin x/x = 1",
      },
      {
        question: "If f(x) = x³ − 6x² + 11x − 6, one root is:",
        options: ["x = 1", "x = 4", "x = −2", "x = 5"],
        correct: 0,
        explanation: "f(1) = 1 − 6 + 11 − 6 = 0",
      },
      {
        question: "∫(2x + 3)dx equals:",
        options: ["x² + 3x + C", "2x² + 3x + C", "x + 3 + C", "2 + C"],
        correct: 0,
        explanation: "∫(2x + 3)dx = x² + 3x + C",
      },
      {
        question: "The determinant of [[1,2],[3,4]] is:",
        options: ["-2", "2", "10", "-10"],
        correct: 0,
        explanation: "det = 1×4 − 2×3 = 4 − 6 = −2",
      },
      {
        question: "How many ways can 5 people be arranged in a row?",
        options: ["60", "100", "120", "150"],
        correct: 2,
        explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120",
      },
    ],
  },
  Physics: {
    Easy: [
      {
        question: "The SI unit of force is:",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correct: 1,
        explanation: "Newton (N) is the SI unit of force",
      },
      {
        question: "Speed of light in vacuum is approximately:",
        options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"],
        correct: 1,
        explanation: "c ≈ 3×10⁸ m/s",
      },
      {
        question: "Which law states F = ma?",
        options: [
          "Newton's 1st Law",
          "Newton's 2nd Law",
          "Newton's 3rd Law",
          "Hooke's Law",
        ],
        correct: 1,
        explanation: "Newton's Second Law: F = ma",
      },
      {
        question: "The unit of electric current is:",
        options: ["Volt", "Ohm", "Ampere", "Watt"],
        correct: 2,
        explanation: "Ampere (A) is the SI unit of electric current",
      },
      {
        question: "What type of lens is used in a magnifying glass?",
        options: ["Concave", "Convex", "Bifocal", "Plano"],
        correct: 1,
        explanation: "A convex (converging) lens is used in magnifying glasses",
      },
    ],
    Medium: [
      {
        question:
          "A body of mass 2 kg moves with velocity 3 m/s. Its kinetic energy is:",
        options: ["6 J", "9 J", "12 J", "18 J"],
        correct: 1,
        explanation: "KE = ½mv² = ½ × 2 × 9 = 9 J",
      },
      {
        question: "Ohm's law states:",
        options: ["V = IR", "P = IV", "F = ma", "E = mc²"],
        correct: 0,
        explanation: "Ohm's Law: V = IR (Voltage = Current × Resistance)",
      },
      {
        question: "The period of a simple pendulum depends on:",
        options: [
          "Mass only",
          "Length only",
          "Both mass and length",
          "Amplitude",
        ],
        correct: 1,
        explanation: "T = 2π√(L/g), period depends only on length",
      },
      {
        question: "In a closed system, the total momentum is:",
        options: [
          "Always increasing",
          "Always decreasing",
          "Conserved",
          "Zero",
        ],
        correct: 2,
        explanation: "Law of conservation of momentum",
      },
      {
        question: "Frequency × Wavelength equals:",
        options: ["Time", "Speed of wave", "Amplitude", "Energy"],
        correct: 1,
        explanation: "v = fλ (speed = frequency × wavelength)",
      },
    ],
    Hard: [
      {
        question: "De Broglie wavelength is given by:",
        options: ["λ = h/mv", "λ = mv/h", "λ = hv/m", "λ = mh/v"],
        correct: 0,
        explanation: "de Broglie wavelength: λ = h/p = h/mv",
      },
      {
        question:
          "The work function of a metal in photoelectric effect determines:",
        options: [
          "Maximum KE of electrons",
          "Threshold frequency",
          "Current magnitude",
          "Wavelength of light",
        ],
        correct: 1,
        explanation:
          "The work function determines the threshold frequency below which no electrons are emitted",
      },
      {
        question: "In an LC circuit, the angular frequency ω is:",
        options: ["1/√LC", "√LC", "√(L/C)", "√(C/L)"],
        correct: 0,
        explanation: "ω = 1/√(LC)",
      },
      {
        question: "Which particles are fermions?",
        options: ["Photons", "Gluons", "Electrons", "Higgs bosons"],
        correct: 2,
        explanation: "Electrons are fermions (half-integer spin)",
      },
      {
        question: "Heisenberg's uncertainty principle involves:",
        options: [
          "Position and velocity",
          "Position and momentum",
          "Energy and time only",
          "Mass and speed",
        ],
        correct: 1,
        explanation: "Δx·Δp ≥ ℏ/2",
      },
    ],
  },
  Chemistry: {
    Easy: [
      {
        question: "Atomic number of Carbon is:",
        options: ["4", "6", "8", "12"],
        correct: 1,
        explanation: "Carbon has atomic number 6",
      },
      {
        question: "Water is composed of:",
        options: ["H₂O", "HO", "H₂O₂", "HO₂"],
        correct: 0,
        explanation: "Water is H₂O (2 hydrogen, 1 oxygen)",
      },
      {
        question: "pH of neutral water at 25°C is:",
        options: ["5", "6", "7", "8"],
        correct: 2,
        explanation: "Pure water has pH = 7 at 25°C",
      },
      {
        question: "NaCl is an example of a:",
        options: [
          "Covalent bond",
          "Ionic bond",
          "Metallic bond",
          "Hydrogen bond",
        ],
        correct: 1,
        explanation: "NaCl (sodium chloride) is an ionic compound",
      },
      {
        question: "The lightest element in the periodic table is:",
        options: ["Helium", "Lithium", "Hydrogen", "Carbon"],
        correct: 2,
        explanation: "Hydrogen is the lightest element (atomic mass ≈ 1)",
      },
    ],
    Medium: [
      {
        question: "Molar mass of H₂SO₄ is:",
        options: ["96 g/mol", "98 g/mol", "100 g/mol", "102 g/mol"],
        correct: 1,
        explanation: "H₂SO₄: 2(1) + 32 + 4(16) = 2 + 32 + 64 = 98 g/mol",
      },
      {
        question: "In electrolysis of water, which gas forms at cathode?",
        options: ["Oxygen", "Hydrogen", "Chlorine", "Nitrogen"],
        correct: 1,
        explanation: "At cathode (−): 2H⁺ + 2e⁻ → H₂",
      },
      {
        question: "Avogadro's number is approximately:",
        options: ["6.02×10²²", "6.02×10²³", "6.02×10²⁴", "6.02×10²¹"],
        correct: 1,
        explanation: "Nₐ ≈ 6.022 × 10²³ mol⁻¹",
      },
      {
        question: "Le Chatelier's principle deals with:",
        options: [
          "Speed of reaction",
          "Equilibrium shift",
          "Enthalpy",
          "Entropy",
        ],
        correct: 1,
        explanation:
          "Le Chatelier's principle: system shifts to counteract applied change",
      },
      {
        question: "Hybridization of carbon in methane (CH₄) is:",
        options: ["sp", "sp²", "sp³", "sp³d"],
        correct: 2,
        explanation: "CH₄: 4 σ-bonds, sp³ hybridization",
      },
    ],
    Hard: [
      {
        question: "Which quantum number determines the shape of an orbital?",
        options: ["n", "l", "ml", "ms"],
        correct: 1,
        explanation: "Azimuthal quantum number (l) determines orbital shape",
      },
      {
        question: "The rate-determining step in a reaction is:",
        options: [
          "The fastest step",
          "The slowest step",
          "The exothermic step",
          "The last step",
        ],
        correct: 1,
        explanation: "The slowest step is rate-limiting",
      },
      {
        question: "Which compound shows geometrical isomerism?",
        options: ["CH₄", "C₂H₆", "2-butene", "Propane"],
        correct: 2,
        explanation: "2-butene (CH₃-CH=CH-CH₃) shows cis/trans isomerism",
      },
      {
        question: "The entropy change (ΔS) for melting of ice is:",
        options: ["Negative", "Zero", "Positive", "Undefined"],
        correct: 2,
        explanation: "Melting increases disorder, so ΔS > 0",
      },
      {
        question: "Nernst equation relates EMF to:",
        options: [
          "Temperature only",
          "Concentration",
          "Pressure",
          "All of the above",
        ],
        correct: 1,
        explanation: "E = E° − (RT/nF)ln Q, relates EMF to concentration",
      },
    ],
  },
  Biology: {
    Easy: [
      {
        question: "The powerhouse of the cell is:",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
        correct: 2,
        explanation: "Mitochondria produce ATP (energy) for the cell",
      },
      {
        question: "DNA stands for:",
        options: [
          "Deoxyribonucleic Acid",
          "Diribonucleic Acid",
          "Deoxyribose Nucleotide Acid",
          "Double Nucleic Acid",
        ],
        correct: 0,
        explanation: "DNA = Deoxyribonucleic Acid",
      },
      {
        question: "Photosynthesis occurs in:",
        options: ["Mitochondria", "Nucleus", "Chloroplasts", "Ribosomes"],
        correct: 2,
        explanation: "Chloroplasts contain chlorophyll for photosynthesis",
      },
      {
        question: "Normal human body temperature is:",
        options: ["35°C", "36°C", "37°C", "38°C"],
        correct: 2,
        explanation: "Normal body temperature is 37°C (98.6°F)",
      },
      {
        question: "Blood group AB is called the:",
        options: [
          "Universal donor",
          "Universal recipient",
          "Rarest type",
          "Most common",
        ],
        correct: 1,
        explanation:
          "AB blood type can receive from all groups — universal recipient",
      },
    ],
    Medium: [
      {
        question: "Meiosis results in:",
        options: [
          "2 diploid cells",
          "4 diploid cells",
          "2 haploid cells",
          "4 haploid cells",
        ],
        correct: 3,
        explanation: "Meiosis produces 4 haploid cells",
      },
      {
        question: "The enzyme that unwinds DNA during replication is:",
        options: ["DNA polymerase", "Helicase", "Ligase", "Primase"],
        correct: 1,
        explanation: "Helicase unwinds the DNA double helix",
      },
      {
        question: "Which vitamin is synthesized by skin in sunlight?",
        options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
        correct: 3,
        explanation: "Skin synthesizes Vitamin D when exposed to UV light",
      },
      {
        question: "The reflex arc does NOT pass through the:",
        options: ["Receptor", "Spinal cord", "Effector", "Cerebrum"],
        correct: 3,
        explanation: "Reflex arcs bypass the brain (cerebrum)",
      },
      {
        question: "Insulin is secreted by:",
        options: ["Alpha cells", "Beta cells", "Delta cells", "Thyroid"],
        correct: 1,
        explanation: "Beta cells of the islets of Langerhans secrete insulin",
      },
    ],
    Hard: [
      {
        question: "The central dogma of molecular biology is:",
        options: [
          "DNA→RNA→Protein",
          "RNA→DNA→Protein",
          "Protein→RNA→DNA",
          "DNA→Protein→RNA",
        ],
        correct: 0,
        explanation: "DNA is transcribed to RNA, then translated to Protein",
      },
      {
        question: "CRISPR-Cas9 is associated with:",
        options: ["PCR", "Gene editing", "Cloning", "Sequencing"],
        correct: 1,
        explanation: "CRISPR-Cas9 is a gene-editing tool",
      },
      {
        question: "Which cells lack a nucleus in mature form?",
        options: ["Neutrophils", "Platelets", "Lymphocytes", "Monocytes"],
        correct: 1,
        explanation: "Mature red blood cells and platelets lack a nucleus",
      },
      {
        question: "The site of protein synthesis is:",
        options: ["Nucleus", "Golgi apparatus", "Ribosome", "ER"],
        correct: 2,
        explanation:
          "Ribosomes are the sites of protein synthesis (translation)",
      },
      {
        question: "Hardy-Weinberg equilibrium requires:",
        options: [
          "Small population",
          "No mutation",
          "Natural selection",
          "Migration",
        ],
        correct: 1,
        explanation:
          "H-W equilibrium assumes no mutation, random mating, large population, no selection or gene flow",
      },
    ],
  },
  History: {
    Easy: [
      {
        question: "India gained independence in:",
        options: ["1945", "1946", "1947", "1948"],
        correct: 2,
        explanation: "India became independent on August 15, 1947",
      },
      {
        question: "The first Prime Minister of India was:",
        options: [
          "Sardar Patel",
          "Jawaharlal Nehru",
          "Rajendra Prasad",
          "Subhas Chandra Bose",
        ],
        correct: 1,
        explanation: "Jawaharlal Nehru was India's first Prime Minister",
      },
      {
        question: "The Battle of Plassey was fought in:",
        options: ["1753", "1757", "1761", "1764"],
        correct: 1,
        explanation:
          "Battle of Plassey: 1757, British East India Company vs Nawab Siraj ud-Daulah",
      },
      {
        question: "The Mughal Empire was founded by:",
        options: ["Akbar", "Humayun", "Babur", "Shah Jahan"],
        correct: 2,
        explanation: "Babur founded the Mughal Empire in 1526",
      },
      {
        question: "Mahatma Gandhi's non-cooperation movement started in:",
        options: ["1919", "1920", "1921", "1922"],
        correct: 1,
        explanation: "Non-Cooperation Movement launched in 1920",
      },
    ],
    Medium: [
      {
        question: "The Jallianwala Bagh massacre occurred in:",
        options: ["1917", "1918", "1919", "1920"],
        correct: 2,
        explanation: "Jallianwala Bagh massacre: April 13, 1919",
      },
      {
        question: "The Quit India Movement was launched in:",
        options: ["1940", "1941", "1942", "1943"],
        correct: 2,
        explanation: "Quit India Movement: August 8, 1942",
      },
      {
        question:
          "The first session of the Indian National Congress was held in:",
        options: ["Bombay", "Calcutta", "Pune", "Madras"],
        correct: 0,
        explanation: "First INC session: December 1885, Bombay",
      },
      {
        question: "The Dandi March was in protest against:",
        options: ["Land tax", "Salt tax", "Cloth tax", "Income tax"],
        correct: 1,
        explanation:
          "Gandhi's Dandi March (1930) protested the British salt tax",
      },
      {
        question: "Swami Vivekananda attended the Parliament of Religions in:",
        options: ["London", "Paris", "Chicago", "New York"],
        correct: 2,
        explanation: "World's Parliament of Religions, Chicago, 1893",
      },
    ],
    Hard: [
      {
        question: "The Subsidiary Alliance was introduced by:",
        options: [
          "Lord Dalhousie",
          "Lord Wellesley",
          "Lord Cornwallis",
          "Lord Hastings",
        ],
        correct: 1,
        explanation:
          "Subsidiary Alliance system introduced by Lord Wellesley (1798)",
      },
      {
        question: "The Indus Valley Civilization was discovered in:",
        options: ["1901", "1911", "1921", "1931"],
        correct: 2,
        explanation: "Indus Valley Civilization discovered in 1921 at Harappa",
      },
      {
        question: "Chandragupta Maurya founded the Maurya Empire around:",
        options: ["320 BCE", "273 BCE", "185 BCE", "250 BCE"],
        correct: 0,
        explanation: "Chandragupta Maurya founded the empire c. 322 BCE",
      },
      {
        question: "The Third Battle of Panipat (1761) was between:",
        options: [
          "Marathas vs Mughals",
          "Marathas vs Afghans",
          "Mughals vs Afghans",
          "British vs Marathas",
        ],
        correct: 1,
        explanation: "Marathas vs Ahmad Shah Durrani (Afghans), 1761",
      },
      {
        question: "The Cabinet Mission Plan was proposed in:",
        options: ["1944", "1945", "1946", "1947"],
        correct: 2,
        explanation: "Cabinet Mission Plan, 1946",
      },
    ],
  },
  Geography: {
    Easy: [
      {
        question: "The longest river in India is:",
        options: ["Yamuna", "Ganga", "Godavari", "Brahmaputra"],
        correct: 1,
        explanation: "The Ganga is the longest river in India",
      },
      {
        question: "Mount Everest is located in:",
        options: ["India", "China", "Nepal", "Bhutan"],
        correct: 2,
        explanation: "Mount Everest is on the Nepal-Tibet border",
      },
      {
        question: "The capital of India is:",
        options: ["Mumbai", "Kolkata", "Chennai", "New Delhi"],
        correct: 3,
        explanation: "New Delhi is the capital of India",
      },
      {
        question: "The Tropic of Cancer passes through:",
        options: [
          "Only South India",
          "Middle India",
          "North India",
          "It doesn't pass through India",
        ],
        correct: 1,
        explanation: "The Tropic of Cancer passes through central India",
      },
      {
        question: "The largest state in India by area is:",
        options: [
          "Maharashtra",
          "Uttar Pradesh",
          "Rajasthan",
          "Madhya Pradesh",
        ],
        correct: 2,
        explanation: "Rajasthan is the largest state by area",
      },
    ],
    Medium: [
      {
        question: "The Western Ghats run along:",
        options: [
          "East coast",
          "West coast",
          "Northern plains",
          "Deccan plateau center",
        ],
        correct: 1,
        explanation: "The Western Ghats run parallel to the west coast",
      },
      {
        question: "Sundarbans mangrove forest is located in:",
        options: ["Odisha", "Maharashtra", "West Bengal", "Andhra Pradesh"],
        correct: 2,
        explanation:
          "Sundarbans, the world's largest mangrove, is in West Bengal",
      },
      {
        question: "The Deccan Plateau is bounded by:",
        options: [
          "Vindhyas and Satpuras to the north",
          "Himalayas to the north",
          "Only Western Ghats",
          "Only Eastern Ghats",
        ],
        correct: 0,
        explanation:
          "The Deccan Plateau is bounded by Vindhyas/Satpuras to the north, Western Ghats on the west, Eastern Ghats on the east",
      },
      {
        question: "Which ocean is to the east of India?",
        options: [
          "Arabian Sea",
          "Bay of Bengal",
          "Indian Ocean",
          "Pacific Ocean",
        ],
        correct: 1,
        explanation: "The Bay of Bengal lies to the east of India",
      },
      {
        question: "Chilika Lake is a famous:",
        options: [
          "Fresh water lake",
          "Saline lagoon",
          "Crater lake",
          "Man-made reservoir",
        ],
        correct: 1,
        explanation:
          "Chilika Lake is Asia's largest brackish water lagoon, in Odisha",
      },
    ],
    Hard: [
      {
        question: "The Indira Point, India's southernmost point, is in:",
        options: [
          "Lakshadweep",
          "Andaman & Nicobar Islands",
          "Tamil Nadu",
          "Kerala",
        ],
        correct: 1,
        explanation:
          "Indira Point (Great Nicobar Island) is India's southernmost point",
      },
      {
        question: "The rain shadow region in India receives:",
        options: ["Heavy rain", "Moderate rain", "Very little rain", "Snow"],
        correct: 2,
        explanation:
          "Rain shadow areas (e.g., Deccan) receive very little rainfall",
      },
      {
        question: "The 'Roaring Forties' refers to:",
        options: [
          "Tropical cyclones",
          "Strong westerly winds at 40°S",
          "Monsoon winds",
          "Trade winds",
        ],
        correct: 1,
        explanation:
          "Roaring Forties: strong westerly winds in 40°–50°S latitudes",
      },
      {
        question: "Which type of farming is dominant in northeast India?",
        options: [
          "Plantation farming",
          "Subsistence farming",
          "Jhum (shifting) cultivation",
          "Commercial farming",
        ],
        correct: 2,
        explanation:
          "Jhum (slash-and-burn) cultivation is traditional in northeast India",
      },
      {
        question: "The Kanchenjunga is located in:",
        options: [
          "Uttarakhand",
          "Himachal Pradesh",
          "Sikkim",
          "Arunachal Pradesh",
        ],
        correct: 2,
        explanation:
          "Kanchenjunga, the 3rd highest peak, borders Sikkim and Nepal",
      },
    ],
  },
  English: {
    Easy: [
      {
        question: "Identify the noun in: 'The cat sat on the mat.'",
        options: ["sat", "on", "cat", "the"],
        correct: 2,
        explanation: "'cat' is a noun (a naming word)",
      },
      {
        question: "Opposite of 'ancient' is:",
        options: ["old", "modern", "new", "recent"],
        correct: 1,
        explanation: "Ancient means very old; its antonym is modern",
      },
      {
        question: "The past tense of 'go' is:",
        options: ["goed", "gone", "went", "going"],
        correct: 2,
        explanation: "The simple past tense of 'go' is 'went'",
      },
      {
        question: "'She is taller ___ her sister.' Fill in:",
        options: ["then", "than", "that", "as"],
        correct: 1,
        explanation: "Use 'than' for comparisons",
      },
      {
        question: "Which is a synonym for 'happy'?",
        options: ["sad", "angry", "joyful", "tired"],
        correct: 2,
        explanation: "'Joyful' means very happy",
      },
    ],
    Medium: [
      {
        question: "Identify the figure of speech: 'The world is a stage.'",
        options: ["Simile", "Metaphor", "Personification", "Alliteration"],
        correct: 1,
        explanation: "Direct comparison without 'like/as' = metaphor",
      },
      {
        question: "'Whom did you call?' — 'Whom' is a:",
        options: [
          "Subject pronoun",
          "Object pronoun",
          "Reflexive pronoun",
          "Possessive pronoun",
        ],
        correct: 1,
        explanation: "'Whom' is used as an object pronoun",
      },
      {
        question: "The passive voice of 'He ate the apple' is:",
        options: [
          "The apple was ate by him",
          "The apple was eaten by him",
          "The apple is eaten by him",
          "The apple had been eaten",
        ],
        correct: 1,
        explanation: "Passive: The apple was eaten by him",
      },
      {
        question: "'Ubiquitous' means:",
        options: ["Rare", "Present everywhere", "Ancient", "Peculiar"],
        correct: 1,
        explanation: "Ubiquitous = present, appearing, or found everywhere",
      },
      {
        question: "A haiku has syllable structure:",
        options: ["7-5-7", "5-7-5", "5-5-7", "7-7-5"],
        correct: 1,
        explanation: "Haiku: 5-7-5 syllables across three lines",
      },
    ],
    Hard: [
      {
        question: "'Sesquipedalian' describes:",
        options: [
          "Short words",
          "Long words",
          "Foreign words",
          "Technical words",
        ],
        correct: 1,
        explanation:
          "Sesquipedalian means using or characterized by long words",
      },
      {
        question: "In Shakespeare's 'Hamlet', who says 'To be or not to be'?",
        options: ["Ophelia", "Claudius", "Hamlet", "Horatio"],
        correct: 2,
        explanation: "Hamlet speaks the famous soliloquy in Act 3, Scene 1",
      },
      {
        question: "An 'epistolary novel' is written as:",
        options: [
          "Poetry",
          "Diary entries",
          "Letters",
          "Both diary and letters",
        ],
        correct: 2,
        explanation: "Epistolary novels are told through a series of letters",
      },
      {
        question: "'Zeugma' is a figure of speech where:",
        options: [
          "A word repeats",
          "One word governs two others",
          "Sound is imitated",
          "Words contrast",
        ],
        correct: 1,
        explanation: "Zeugma: one word applies to two others in different ways",
      },
      {
        question: "Which novel opens with 'Call me Ishmael'?",
        options: [
          "The Great Gatsby",
          "Moby-Dick",
          "Ulysses",
          "The Old Man and the Sea",
        ],
        correct: 1,
        explanation:
          "Moby-Dick by Herman Melville opens with 'Call me Ishmael'",
      },
    ],
  },
};

type Phase = "setup" | "quiz" | "result";
interface Answer {
  selected: number;
  correct: boolean;
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [subject, setSubject] = useState("Mathematics");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "history">("quiz");

  const { data: attempts, isLoading: attemptsLoading } = useQuizAttempts();
  const addAttempt = useAddQuizAttempt();

  const startQuiz = () => {
    const pool =
      QUESTION_BANK[subject]?.[difficulty] || QUESTION_BANK.Mathematics.Medium;
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setShowAnswer(false);
    setPhase("quiz");
  };

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setAnswers((prev) => [
      ...prev,
      { selected: idx, correct: idx === questions[current].correct },
    ]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  const finishQuiz = async () => {
    const score =
      answers.filter((a) => a.correct).length +
      (selected !== null && answers.length === current
        ? selected === questions[current].correct
          ? 1
          : 0
        : 0);
    const pct = Math.round((score / questions.length) * 100);
    try {
      await addAttempt.mutateAsync({
        topic: difficulty,
        subject,
        score: BigInt(pct),
        questionsAnswered: BigInt(questions.length),
      });
    } catch {
      toast.error("Could not save quiz result");
    }
    setPhase("result");
  };

  const finalScore = answers.filter((a) => a.correct).length;
  const pct =
    questions.length > 0
      ? Math.round((finalScore / questions.length) * 100)
      : 0;

  return (
    <div className="pb-4">
      <div className="bg-primary px-5 pt-14 pb-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold text-primary-foreground mb-1">
          Quiz Engine
        </h1>
        <p className="text-primary-foreground/70 text-sm">
          Test your knowledge, earn mastery!
        </p>
      </div>

      <div className="px-4 pt-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["quiz", "history"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`quiz.${t}.tab`}
              onClick={() => {
                setActiveTab(t);
                setPhase("setup");
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground"
              }`}
            >
              {t === "quiz" ? "Take Quiz" : "History"}
            </button>
          ))}
        </div>

        {activeTab === "history" ? (
          <div data-ocid="quiz.history.panel">
            <h2 className="font-bold text-foreground mb-3">Past Attempts</h2>
            {attemptsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 rounded-2xl" />
                ))}
              </div>
            ) : !attempts?.length ? (
              <div
                data-ocid="quiz.history.empty_state"
                className="bg-card rounded-2xl p-8 text-center"
              >
                <ListChecks className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  No quiz attempts yet. Take your first quiz!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...attempts].reverse().map((a, i) => (
                  <div
                    key={
                      a.subject + String(a.score) + String(a.questionsAnswered)
                    }
                    data-ocid={`quiz.history.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-semibold text-foreground text-sm">
                          {a.subject}
                        </span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {a.topic}
                        </span>
                      </div>
                      <Badge
                        variant={
                          Number(a.score) >= 60 ? "default" : "destructive"
                        }
                      >
                        {String(a.score)}%
                      </Badge>
                    </div>
                    <Progress value={Number(a.score)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {String(a.questionsAnswered)} questions answered
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : phase === "setup" ? (
          <div data-ocid="quiz.setup.panel">
            <div className="bg-card rounded-2xl p-4 shadow-xs mb-4">
              <p className="block text-sm font-semibold text-foreground mb-2">
                Subject
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    data-ocid="quiz.subject.toggle"
                    onClick={() => setSubject(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      subject === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-xs mb-6">
              <p className="block text-sm font-semibold text-foreground mb-2">
                Difficulty
              </p>
              <div className="flex gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    data-ocid="quiz.difficulty.toggle"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <Button
              data-ocid="quiz.start.primary_button"
              className="w-full h-12 text-base font-bold rounded-xl"
              onClick={startQuiz}
            >
              Start Quiz — 5 Questions
            </Button>
          </div>
        ) : phase === "quiz" ? (
          <div data-ocid="quiz.question.panel">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">
                Question {current + 1} of {questions.length}
              </span>
              <Badge variant="secondary">{difficulty}</Badge>
            </div>
            <Progress
              value={(current / questions.length) * 100}
              className="h-1.5 mb-4"
            />

            <div className="bg-card rounded-2xl p-5 shadow-xs mb-4">
              <p className="font-semibold text-foreground text-base leading-relaxed">
                {questions[current]?.question}
              </p>
            </div>

            <div className="space-y-3 mb-4">
              {questions[current]?.options.map((opt, idx) => {
                let cls = "bg-card text-foreground border-border";
                if (showAnswer) {
                  if (idx === questions[current].correct)
                    cls = "bg-green-50 text-green-700 border-green-300";
                  else if (idx === selected)
                    cls = "bg-red-50 text-red-600 border-red-300";
                  else
                    cls =
                      "bg-card text-muted-foreground border-border opacity-60";
                } else if (idx === selected) {
                  cls = "bg-primary/10 text-primary border-primary";
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    data-ocid={`quiz.option.${idx + 1}.button`}
                    onClick={() => handleSelect(idx)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium text-sm transition-all ${cls}`}
                  >
                    <span className="font-bold mr-2">
                      {["A", "B", "C", "D"][idx]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showAnswer && (
              <div className="bg-blue-50 rounded-xl p-3 mb-4">
                <p className="text-blue-700 text-sm">
                  <span className="font-bold">Explanation: </span>
                  {questions[current]?.explanation}
                </p>
              </div>
            )}

            {showAnswer && (
              <Button
                data-ocid="quiz.next.primary_button"
                className="w-full h-12 rounded-xl font-bold"
                onClick={handleNext}
              >
                {current + 1 >= questions.length
                  ? "See Results"
                  : "Next Question"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        ) : (
          <div data-ocid="quiz.result.panel" className="text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                pct >= 60 ? "bg-green-100" : "bg-red-50"
              }`}
            >
              {pct >= 60 ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {pct >= 80
                ? "Excellent!"
                : pct >= 60
                  ? "Good Job!"
                  : "Keep Practicing!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {finalScore}/{questions.length} correct — {pct}%
            </p>

            <div className="space-y-2 mb-6 text-left">
              {answers.map((a, i) => (
                <div
                  key={questions[i]?.question.slice(0, 20) + String(i)}
                  data-ocid={`quiz.result.item.${i + 1}`}
                  className="flex items-center gap-3 bg-card rounded-xl p-3"
                >
                  {a.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {questions[i]?.question}
                    </p>
                    {!a.correct && (
                      <p className="text-xs text-green-600">
                        Correct: {questions[i]?.options[questions[i]?.correct]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              data-ocid="quiz.retry.primary_button"
              className="w-full h-12 rounded-xl font-bold"
              onClick={() => setPhase("setup")}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Another Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
