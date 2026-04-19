
import React, { useState, useEffect } from "react";
import { Sparkles, Brain, ArrowRight, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface Props {
  topic: string;
  score: number;
  key?: string;
}

const STATIC_METRICS: Record<string, { summary: string, tips: string[] }> = {
  "Calculus": {
    summary: "Calculus serves as the mathematical foundation for rate-of-change analysis and optimization. Mastery involves deep understanding of the Fundamental Theorem and differential equations.",
    tips: [
      "Practice the Chain Rule on complex composite functions to automate your differentiation workflow.",
      "Visualize Integrals as the area under a curve to better grasp the accumulation of change.",
      "Review L'Hopital's Rule for handling indeterminate limit forms encountered in edge cases."
    ]
  },
  "Frontend Technologies": {
    summary: "Modern frontend engineering demands mastery of state management, component lifecycles, and performance-critical rendering patterns in a single-page application context.",
    tips: [
      "Deep dive into the Dependency Array of useEffect to avoid infinite render loops and stale closures.",
      "Master CSS Grid and Flexbox to build truly responsive layouts without excessive media query overhead.",
      "Experiment with Server-Side Rendering (SSR) via Next.js to improve SEO and Core Web Vitals."
    ]
  },
  "Python Programming": {
    summary: "Python's strength lies in its readability and extensive ecosystem. Efficient development requires understanding its idiomatic patterns and internal data structures.",
    tips: [
      "Utilize List Comprehensions for cleaner, more Pythonic code when performing standard data transformations.",
      "Understand the Global Interpreter Lock (GIL) and how it impacts multi-threaded performance in CPU-bound tasks.",
      "Adopt PEP 8 style guides strictly to ensure maintainability in large-scale collaborative codebases."
    ]
  },
  "Generative AI": {
    summary: "Inference at scale relies on the Transformer architecture. Prompt Engineering and Retrieval Augmented Generation (RAG) are critical for grounding model outputs in reality.",
    tips: [
      "Study the Attention Mechanism code to understand how models assign weight to specific input tokens.",
      "Implement RAG pipelines to reduce hallucination rates by providing external vector-based context.",
      "Test different Temperature settings to find the optimal balance between creative output and deterministic accuracy."
    ]
  },
  "Machine Learning": {
    summary: "The goal of ML is generalization. Balancing bias and variance through regularization is the key to creating models that perform well on unseen telemetry.",
    tips: [
      "Apply L1 or L2 Regularization to combat overfitting when your model's test delta is significantly higher than training.",
      "Master Feature Scaling (Normalization/Standardization) to speed up Gradient Descent convergence.",
      "Evaluate performance using F1-Score instead of Accuracy when dealing with highly imbalanced class distributions."
    ]
  }
};

export default function StudyTips({ topic, score }: Props) {
  const [tips, setTips] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Deterministic recommendation logic instead of GenAI inference
    function loadLocalTips() {
      setLoading(true);
      
      // Simulate slight processing delay for "Smart" feel
      const timeout = setTimeout(() => {
        const data = STATIC_METRICS[topic] || {
          summary: "Analysis suggests further review of this module's entropy patterns and core principles.",
          tips: ["Focus on core concepts", "Review recent assessments", "Consult technical documentation"]
        };
        
        setTips(data.tips);
        setSummary(data.summary);
        setLoading(false);
      }, 400);

      return () => clearTimeout(timeout);
    }

    if (topic) loadLocalTips();
  }, [topic, score]);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 animate-pulse flex-grow">
        <div className="h-6 w-32 bg-border/20 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-border/10 rounded" />
          <div className="h-4 w-3/4 bg-border/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface border border-border rounded-xl p-6 flex flex-col gap-6 flex-grow relative overflow-hidden group"
    >
      <div className="absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Terminal className="w-24 h-24 text-accent" />
      </div>

      <div className="flex justify-between items-center border-b border-border pb-4 relative z-10">
         <div className="flex items-center gap-2">
           <Brain className="w-4 h-4 text-accent" />
           <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Deterministic Study Coach</span>
         </div>
         <span className="text-[10px] text-text-dim border border-border px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Local Engine</span>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="font-serif italic text-lg leading-relaxed text-text-primary">
          "{summary}"
        </div>

        <div className="space-y-3 pt-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-4 text-sm text-text-secondary leading-snug items-start group/tip">
                <span className="text-accent font-bold text-[10px] tracking-tighter mt-1 group-hover/tip:scale-125 transition-transform">0{i + 1}</span>
                <span className="group-hover/tip:text-text-primary transition-colors">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
