import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface QuizAttempt {
    questionsAnswered: bigint;
    topic: string;
    subject: string;
    score: bigint;
}
export interface StudySession {
    subject: string;
    date: Time;
    durationMinutes: bigint;
}
export interface ChatMessage {
    question: string;
    answer: string;
    timestamp: Time;
}
export interface UserProfile {
    subjects: Array<string>;
    name: string;
    examType: ExamType;
}
export interface Note {
    title: string;
    topic: string;
    content: string;
    subject: string;
}
export enum ExamType {
    jee = "jee",
    neet = "neet",
    upsc = "upsc",
    class10 = "class10",
    class12 = "class12"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatMessage(question: string, answer: string): Promise<void>;
    addNote(note: Note): Promise<void>;
    addQuizAttempt(quiz: QuizAttempt): Promise<void>;
    addStudySession(session: StudySession): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearUserData(): Promise<void>;
    deleteNote(title: string): Promise<void>;
    getAllNotes(userId: Principal): Promise<Array<Note>>;
    getAllStudySessions(userId: Principal): Promise<Array<StudySession>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile>;
    getCallerUserRole(): Promise<UserRole>;
    getChatHistory(): Promise<Array<ChatMessage>>;
    getNotes(): Promise<Array<Note>>;
    getQuizAttempts(): Promise<Array<QuizAttempt>>;
    getStats(userId: Principal): Promise<{
        avgScore: bigint;
        notesCount: bigint;
        totalSessions: bigint;
        chatCount: bigint;
    }>;
    getStudySessions(): Promise<Array<StudySession>>;
    getUserProfile(user: Principal): Promise<UserProfile>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchNotes(searchTerm: string): Promise<Array<Note>>;
    updateNote(updatedNote: Note): Promise<void>;
}
