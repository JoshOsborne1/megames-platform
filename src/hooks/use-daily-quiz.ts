"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { PACKS, getDecksByPack, getQuestionsByDeck } from "@/lib/games/quiz-quarter/data";
import type { Question } from "@/lib/games/quiz-quarter/types";

interface DailyQuizState {
  todayQuestions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  isComplete: boolean;
  streak: number;
  lastPlayedDate: string | null;
  isLoading: boolean;
}

interface DailyQuizProgress {
  streak: number;
  lastPlayedDate: string | null;
  todayCompleted: boolean;
  correctToday: number;
}

const STORAGE_KEY = "partypack_daily_quiz";

// Generate a seeded random number for consistent daily questions
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Get today's date string in YYYY-MM-DD format
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

// Get a numeric seed from date string
function getDateSeed(dateStr: string): number {
  return dateStr.split("-").reduce((acc, part) => acc * 100 + parseInt(part), 0);
}

// Get 5 questions for today using seeded randomness
// Collect all questions from all packs/decks ONCE outside the hook
const ALL_QUESTIONS_POOL: Question[] = (() => {
  const pool: Question[] = [];
  PACKS.forEach(pack => {
    const decks = getDecksByPack(pack.id);
    decks.forEach(deck => {
      const questions = getQuestionsByDeck(deck.id);
      pool.push(...questions);
    });
  });
  return pool;
})();

// Get 5 questions for today using seeded randomness
function getDailyQuestions(dateStr: string): Question[] {
  const seed = getDateSeed(dateStr);
  const random = seededRandom(seed);
  
  // Shuffle using seeded random
  const shuffled = [...ALL_QUESTIONS_POOL].sort(() => random() - 0.5);
  
  // Return first 5 questions
  return shuffled.slice(0, 5);
}

export function useDailyQuiz() {
  const [state, setState] = useState<DailyQuizState>({
    todayQuestions: [],
    currentQuestionIndex: 0,
    correctAnswers: 0,
    isComplete: false,
    streak: 0,
    lastPlayedDate: null,
    isLoading: true,
  });
  
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // Load progress from localStorage or Supabase
  const loadProgress = useCallback(async (currentUser: SupabaseUser | null): Promise<DailyQuizProgress> => {
    const today = getTodayString();
    
    // Try Supabase first if logged in (in background usually)
    if (currentUser) {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("user_stats")
          .select("daily_quiz_streak, daily_quiz_last_date")
          .eq("user_id", currentUser.id)
          .single();
        
        if (data) {
          const lastDate = data.daily_quiz_last_date;
          const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          
          // Calculate streak based on last played date
          let streak = data.daily_quiz_streak || 0;
          if (lastDate !== today && lastDate !== yesterdayStr) {
            streak = 0;
          }
          
          return {
            streak,
            lastPlayedDate: lastDate,
            todayCompleted: lastDate === today,
            correctToday: 0, 
          };
        }
      } catch (error) {
        console.warn("Failed to load from Supabase", error);
      }
    }
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const lastDate = parsed.lastPlayedDate;
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        
        let streak = parsed.streak || 0;
        if (lastDate !== today && lastDate !== yesterdayStr) {
          streak = 0;
        }
        
        return {
          streak,
          lastPlayedDate: lastDate,
          todayCompleted: lastDate === today,
          correctToday: lastDate === today ? parsed.correctToday || 0 : 0,
        };
      }
    } catch (error) {
      console.warn("Failed to load from localStorage", error);
    }
    
    return { streak: 0, lastPlayedDate: null, todayCompleted: false, correctToday: 0 };
  }, []);

  // Save progress to localStorage and Supabase (if logged in)
  const saveProgress = useCallback(async (
    streak: number,
    lastPlayedDate: string,
    correctToday: number,
    currentUser: SupabaseUser | null
  ) => {
    // Always save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        streak,
        lastPlayedDate,
        correctToday,
      }));
    } catch (error) {
      console.warn("Failed to save to localStorage", error);
    }
    
    // Also save to Supabase if logged in
    if (currentUser) {
      try {
        const supabase = createClient();
        await supabase
          .from("user_stats")
          .upsert({
            user_id: currentUser.id,
            daily_quiz_streak: streak,
            daily_quiz_last_date: lastPlayedDate,
          }, { onConflict: "user_id" });
      } catch (error) {
        console.warn("Failed to save to Supabase", error);
      }
    }
  }, []);

  // Initialize quiz with local-first strategy
  useEffect(() => {
    async function init() {
      const today = getTodayString();
      const questions = getDailyQuestions(today);
      
      // Phase 1: Rapid local load
      const localStored = localStorage.getItem(STORAGE_KEY);
      let localProgress: DailyQuizProgress = { streak: 0, lastPlayedDate: null, todayCompleted: false, correctToday: 0 };
      
      if (localStored) {
        try {
          const parsed = JSON.parse(localStored);
          const lastDate = parsed.lastPlayedDate;
          const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
          let streak = parsed.streak || 0;
          if (lastDate !== today && lastDate !== yesterdayStr) streak = 0;
          
          localProgress = {
            streak,
            lastPlayedDate: lastDate,
            todayCompleted: lastDate === today,
            correctToday: lastDate === today ? parsed.correctToday || 0 : 0,
          };
        } catch { }
      }

      setState({
        todayQuestions: questions,
        currentQuestionIndex: localProgress.todayCompleted ? 5 : 0,
        correctAnswers: localProgress.correctToday,
        isComplete: localProgress.todayCompleted,
        streak: localProgress.streak,
        lastPlayedDate: localProgress.lastPlayedDate,
        isLoading: false,
      });

      // Phase 2: Auth and Supabase Sync in background
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (authUser) {
        const progress = await loadProgress(authUser);
        setState(prev => ({
          ...prev,
          currentQuestionIndex: progress.todayCompleted ? 5 : prev.currentQuestionIndex,
          correctAnswers: progress.todayCompleted ? progress.correctToday : prev.correctAnswers,
          isComplete: progress.todayCompleted ? true : prev.isComplete,
          streak: progress.streak,
          lastPlayedDate: progress.lastPlayedDate,
        }));
      }
    }
    
    init();
  }, [loadProgress]);

  // Answer a question - DOES NOT advance index (UI handles that via nextQuestion)
  const answerQuestion = useCallback(async (selectedAnswer: string) => {
    let isCorrect = false;
    
    setState(prev => {
      const currentQuestion = prev.todayQuestions[prev.currentQuestionIndex];
      if (!currentQuestion) return prev;
      
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      const newCorrect = prev.correctAnswers + (isCorrect ? 1 : 0);
      
      return {
        ...prev,
        correctAnswers: newCorrect,
      };
    });
    
    return isCorrect;
  }, []);

  // Explicitly move to next question
  const nextQuestion = useCallback(async () => {
    const today = getTodayString();
    const newIndex = state.currentQuestionIndex + 1;
    const isNowComplete = newIndex >= 5;
    let newStreak = state.streak;

    if (isNowComplete && state.lastPlayedDate !== today) {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (state.lastPlayedDate === yesterdayStr || state.streak === 0) {
        newStreak = state.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    setState(prev => ({
      ...prev,
      currentQuestionIndex: newIndex,
      isComplete: isNowComplete,
      streak: isNowComplete ? newStreak : prev.streak,
      lastPlayedDate: isNowComplete ? today : prev.lastPlayedDate,
    }));

    // Save final results
    if (isNowComplete) {
      // Use state.correctAnswers as it was just updated by answerQuestion 
      // which was called before handleAnswer's timeout
      await saveProgress(newStreak, today, state.correctAnswers, user);
    }
  }, [state.currentQuestionIndex, state.streak, state.lastPlayedDate, state.correctAnswers, user, saveProgress]);

  // Reset for replay
  const resetQuiz = useCallback(() => {
    const today = getTodayString();
    const questions = getDailyQuestions(today);
    
    setState(prev => ({
      ...prev,
      todayQuestions: questions,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      isComplete: false,
    }));
  }, []);

  // Calculate shuffled answers for current question
  const currentQuestionIdx = state.currentQuestionIndex;
  const currentQuestion = state.todayQuestions[currentQuestionIdx];

  const getShuffledAnswers = (question: Question | undefined) => {
    if (!question) return [];
    const seed = getDateSeed(getTodayString()) + question.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    const random = seededRandom(seed);
    return [question.correctAnswer, ...question.incorrectAnswers].sort(() => random() - 0.5);
  };

  return {
    questions: state.todayQuestions,
    currentQuestion: currentQuestion ? {
      ...currentQuestion,
      shuffledAnswers: getShuffledAnswers(currentQuestion)
    } : null,
    currentQuestionIndex: state.currentQuestionIndex,
    correctAnswers: state.correctAnswers,
    isComplete: state.isComplete,
    streak: state.streak,
    isLoading: state.isLoading,
    isLoggedIn: !!user,
    answerQuestion,
    nextQuestion,
    resetQuiz,
  };
}
