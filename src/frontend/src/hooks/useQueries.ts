import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Note, QuizAttempt, StudySession, UserProfile } from "../backend";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

export function useChatHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChatHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChatMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      question,
      answer,
    }: { question: string; answer: string }) => {
      if (!actor) throw new Error("Not connected");
      await actor.addChatMessage(question, answer);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chatHistory"] }),
  });
}

export function useNotes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (note: Note) => {
      if (!actor) throw new Error("Not connected");
      await actor.addNote(note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteNote(title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useSearchNotes(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["searchNotes", term],
    queryFn: async () => {
      if (!actor || !term) return [];
      return actor.searchNotes(term);
    },
    enabled: !!actor && !isFetching && term.length > 0,
  });
}

export function useQuizAttempts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["quizAttempts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuizAttempts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddQuizAttempt() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (quiz: QuizAttempt) => {
      if (!actor) throw new Error("Not connected");
      await actor.addQuizAttempt(quiz);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quizAttempts"] }),
  });
}

export function useStudySessions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studySessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudySessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddStudySession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (session: StudySession) => {
      if (!actor) throw new Error("Not connected");
      await actor.addStudySession(session);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["studySessions"] }),
  });
}

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const profile = await actor.getCallerUserProfile();
        // We need the principal — use actor to get it
        const sessions = await actor.getStudySessions();
        const notes = await actor.getNotes();
        const quiz = await actor.getQuizAttempts();
        const chat = await actor.getChatHistory();
        const avgScore =
          quiz.length > 0
            ? quiz.reduce((s, q) => s + Number(q.score), 0) / quiz.length
            : 0;
        return {
          totalSessions: BigInt(sessions.length),
          notesCount: BigInt(notes.length),
          chatCount: BigInt(chat.length),
          avgScore: BigInt(Math.round(avgScore)),
          profile,
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
