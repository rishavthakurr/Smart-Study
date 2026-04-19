/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BookOpen, LayoutDashboard, BrainCircuit, Sparkles, LogOut, RotateCcw, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import Dashboard from "./components/Dashboard";
import Quiz from "./components/Quiz";
import Onboarding from "./components/Onboarding";

type View = "dashboard" | "quiz";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [data, setData] = useState<any>(null);
  const [mastery, setMastery] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fetchData = async () => {
    try {
      const [dataRes, masteryRes] = await Promise.all([
        fetch("/api/data"),
        fetch("/api/mastery")
      ]);

      if (!dataRes.ok || !masteryRes.ok) {
        throw new Error(`Server returned error: ${dataRes.status} / ${masteryRes.status}`);
      }

      const [dataJson, masteryJson] = await Promise.all([
        dataRes.json(),
        masteryRes.json()
      ]);

      setData(dataJson);
      setMastery(masteryJson);
      
      // Show onboarding if no quiz data exists and user hasn't seen it
      const hasOnboarded = localStorage.getItem("study_assistant_onboarded");
      if (!hasOnboarded && dataJson.quizzes?.length === 0) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error("Critical Failure: Study data retrieval synchrony lost.", err);
    }
  };

  const handleReset = async () => {
    try {
      await fetch("/api/reset", { method: "POST" });
      localStorage.removeItem("study_assistant_onboarded");
      setShowResetConfirm(false);
      await fetchData();
      setCurrentView("dashboard");
    } catch (err) {
      console.error("Failed to reset progress", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-accent/30">
      <AnimatePresence>
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        
        {showResetConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-bg/95 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface border border-border rounded-xl w-full max-w-md p-10 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="absolute top-6 right-6 text-text-dim hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mb-6 text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-serif italic mb-4 leading-tight">Data Finalization</h2>
              <p className="text-text-secondary text-sm italic leading-relaxed mb-8">
                "Performing this operation will recursively purge all persistence records from the data.json layer and re-initialize the ML trajectory."
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded uppercase text-[10px] tracking-widest transition-all"
                >
                  Confirm Full Data Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-3 border border-border hover:bg-surface text-text-dim hover:text-text-primary rounded uppercase text-[10px] tracking-widest transition-all"
                >
                  Cancel Operation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-[240px] bg-bg border-r border-border flex flex-col py-8 z-50 px-6 gap-10">
        <div className="flex items-center gap-2">
          <span className="font-serif text-2xl italic tracking-tight text-text-primary">SmartStudy.</span>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <NavButton 
            active={currentView === "dashboard"} 
            onClick={() => setCurrentView("dashboard")}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Dashboard"
          />
          <NavButton 
            active={currentView === "quiz"} 
            onClick={() => setCurrentView("quiz")}
            icon={<BookOpen className="w-4 h-4" />}
            label="Quiz Center"
          />
        </div>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-3 px-3 py-2 text-[11px] text-text-dim hover:text-red-400 transition-colors uppercase font-bold tracking-widest group"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-90deg] transition-transform duration-500" />
            Reset Progress
          </button>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-text-dim mb-2 font-bold">Status</div>
            <div className="flex items-center gap-2 text-sm text-[#10b981]">
              <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="font-medium">Backend Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="ml-[240px] p-10 min-h-screen flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-[2.5rem] leading-none mb-2">
              {currentView === "dashboard" ? "Mastery Insights" : "Assessment Center"}
            </h1>
            <p className="text-text-secondary text-sm">
              {currentView === "dashboard" 
                ? "Real-time analytics powered by Scikit-Learn Linear Regression" 
                : "Challenge yourself and improve your scores through data."}
            </p>
          </div>
          <div className="text-right">
             <div className="text-4xl font-serif">
                {mastery?.mastery ? (Object.values(mastery.mastery as Record<string, any>).reduce((a, b) => a + b.current, 0) / Object.keys(mastery.mastery).length || 0).toFixed(1) : "0.0"}%
             </div>
             <div className="text-[10px] uppercase tracking-widest text-text-dim font-bold">Avg. Mastery</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentView === "dashboard" ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard masteryData={mastery} />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Quiz onComplete={() => {
                fetchData();
                setCurrentView("dashboard");
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm",
        active 
          ? "bg-surface text-accent border border-border shadow-sm" 
          : "text-text-secondary hover:text-text-primary hover:bg-surface/50"
      )}
    >
      <div className={cn("transition-colors", active ? "text-accent" : "text-text-dim")}>
        {icon}
      </div>
      <span className="font-medium">
        {label}
      </span>
    </button>
  );
}
