
import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Zap, AlertTriangle, Sparkles, Database, BrainCircuit } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import StudyTips from "./StudyTips";

interface MasteryData {
  current: number;
  predicted: number;
  count: number;
}

interface MasteryResponse {
  mastery: Record<string, MasteryData>;
  recommendation: string;
}

export default function Dashboard({ masteryData }: { masteryData: MasteryResponse | null }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/data")
      .then(res => {
        if (!res.ok) throw new Error("Persistence fetch failed");
        return res.json();
      })
      .then(data => {
        if (data?.quizzes) {
          setLogs(data.quizzes.slice(-3).reverse());
        }
      })
      .catch(err => {
        console.error("Telemetry sync failure", err);
      });
  }, []);

  if (!masteryData || !masteryData.mastery || Object.keys(masteryData.mastery).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-surface border border-border rounded-xl flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-text-dim" />
        </div>
        <h3 className="text-xl font-serif italic mb-2">No Study Data Found</h3>
        <p className="text-text-secondary text-sm max-w-xs">Take your first quiz to generate mastery predictions and AI insights.</p>
      </div>
    );
  }

  const mastery = masteryData.mastery;
  const topics = Object.entries(mastery);
  const recommendation = masteryData.recommendation;

  return (
    <div className="flex flex-col gap-8">
      {/* Dynamic Recommendation Card - Technical Style */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-accent-soft border border-accent/20 rounded-xl p-8 overflow-hidden group hover:border-accent/40 transition-all shadow-xl shadow-accent/5"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
           <BrainCircuit className="w-32 h-32 text-accent" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="px-2 py-0.5 border border-accent rounded text-[10px] font-bold text-accent uppercase tracking-widest">Priority Target</div>
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[10px] uppercase font-bold tracking-widest text-text-dim mb-2 italic">Recommended for You:</h2>
              <div className="text-4xl md:text-5xl font-serif italic text-text-primary tracking-tight mb-2">
                {recommendation} Assessment
              </div>
              <p className="text-text-secondary text-sm italic max-w-md">
                Based on current ML entropy levels, this topic represents the most efficient path to improving your aggregate mastery score.
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
               <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim text-right">Predicted Delta</div>
               <div className="text-3xl font-serif text-accent italic">+{Math.max(10, (100 - mastery[recommendation].predicted) / 2).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Prediction Card */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
             <span className="text-[10px] uppercase font-bold tracking-widest text-text-dim">ML Prediction Model</span>
             <span className="text-[10px] text-accent border border-accent px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Linear Regression</span>
          </div>
          
          <div className="flex flex-col gap-5 flex-1">
            {topics.map(([topic, data]) => (
              <div key={topic} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">{topic}</span>
                  <span className={cn("text-sm font-bold", data.predicted < 60 ? "text-red-500" : "text-text-primary")}>
                    {data.predicted.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.predicted}%` }}
                    className={cn("h-full transition-colors", data.predicted < 60 ? "bg-red-500" : "bg-accent")}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Card */}
        <div className="flex flex-col gap-6 h-full">
           <StudyTips 
             topic={recommendation} 
             score={mastery[recommendation].current} 
           />
           
           {topics.filter(([t, d]) => t !== recommendation && d.predicted < 60).length > 0 && (
             <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
                <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Secondary Areas of Concern
                </div>
                <div className="flex flex-wrap gap-2">
                  {topics.filter(([t, d]) => t !== recommendation && d.predicted < 60).map(([topic]) => (
                    <span key={topic} className="text-[11px] bg-bg border border-border px-2 py-1 rounded text-text-secondary italic">
                      {topic}
                    </span>
                  ))}
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Persistence Log Card */}
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col h-[280px]">
          <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
             <span className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Persistence Layer (data.json)</span>
             <span className="text-[10px] text-text-dim font-bold tracking-widest">LATEST APPENDS</span>
          </div>
          
          <div className="flex flex-col text-[13px] font-mono leading-relaxed">
            <div className="grid grid-cols-[100px_1fr_80px_120px] pb-3 text-[10px] uppercase font-bold tracking-widest text-text-dim border-b border-border/30 mb-2">
                <div>Time</div>
                <div>Topic</div>
                <div>Score</div>
                <div>Operation</div>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="grid grid-cols-[100px_1fr_80px_120px] py-3 border-b border-border/20 last:border-0 hover:bg-bg/50 transition-colors">
                  <div className="text-text-dim">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className="text-text-primary">{log.topic}</div>
                  <div className={cn("font-bold", log.score >= 80 ? "text-[#10b981]" : log.score < 60 ? "text-red-500" : "text-amber-500")}>
                    {log.score.toFixed(0)}%
                  </div>
                  <div className="text-text-dim">write_json()</div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 transition-all hover:border-text-dim">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-bg rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-2xl font-serif italic mb-1">{value}</div>
      <div className="text-[11px] text-text-secondary font-medium tracking-tight opacity-70">{sub}</div>
    </div>
  );
}
