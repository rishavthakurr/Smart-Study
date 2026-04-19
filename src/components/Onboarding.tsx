
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Brain, Sparkles, ChevronRight, Check, Rocket } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Mastery via Machine Learning",
    description: "Our backend uses Scikit-Learn Linear Regression to analyze your study patterns and predict your mastery trajectory for each topic.",
    icon: <Brain className="w-6 h-6" />,
    tag: "Predictive Analytics"
  },
  {
    title: "Gemini AI Tutoring",
    description: "When your mastery prediction dips below 60%, the AI Tutor activates. It uses Gemini Flash to generate personalized study tips and core concept summaries.",
    icon: <Sparkles className="w-6 h-6" />,
    tag: "GenAI Tutor"
  },
  {
    title: "Persistence Layer",
    description: "Every assessment you take is logged to our data.json persistence layer, ensuring your progress is tracked over time without complex databases.",
    icon: <Rocket className="w-6 h-6" />,
    tag: "Data Driven"
  }
];

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("study_assistant_onboarded", "true");
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/90 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10 border-b border-border/50 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent">{STEPS[step].tag}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-dim text-right">Step 0{step + 1} / 0{STEPS.length}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-accent-soft border border-accent/20 rounded-lg flex items-center justify-center mb-6 text-accent">
                {STEPS[step].icon}
              </div>
              
              <h2 className="text-3xl font-serif italic mb-4 leading-tight">
                {STEPS[step].title}
              </h2>
              
              <p className="text-text-secondary leading-relaxed text-sm mb-8 italic">
                "{STEPS[step].description}"
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/50">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 transition-all duration-300 rounded-full",
                    i === step ? "w-8 bg-accent" : "w-2 bg-border"
                  )} 
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 group px-6 py-2.5 bg-accent hover:bg-accent/90 text-white rounded font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-accent/20"
            >
              {step === STEPS.length - 1 ? "Initialize Experience" : "Continue"}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
