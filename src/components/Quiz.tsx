
import React, { useState } from "react";
import { CheckCircle2, ChevronRight, BookOpen, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const TOPICS = ["Calculus", "Frontend Technologies", "Python Programming", "Generative AI", "Machine Learning"];

const QUESTION_POOL: Record<string, { q: string, a: string[], correct: number }[]> = {
  "Calculus": [
    { q: "What is the derivative of x^2?", a: ["x", "2x", "x^3", "2x^2"], correct: 1 },
    { q: "What is the integral of 1/x?", a: ["ln(x)", "e^x", "log10(x)", "1"], correct: 0 },
    { q: "What is the limit of sin(x)/x as x approaches 0?", a: ["0", "1", "infinity", "undefined"], correct: 1 },
    { q: "Who credited with inventing Calculus alongside Newton?", a: ["Galileo", "Leibniz", "Euler", "Gauss"], correct: 1 },
    { q: "What is the derivative of sin(x)?", a: ["cos(x)", "-cos(x)", "sin(x)", "tan(x)"], correct: 0 },
    { q: "What is the second derivative of x^3?", a: ["3x", "6x", "3x^2", "6"], correct: 1 },
    { q: "What is the integral of cos(x)?", a: ["sin(x)", "-sin(x)", "tan(x)", "cos(x)"], correct: 0 },
    { q: "The 'Power Rule' for derivatives d/dx[x^n] equals?", a: ["n*x^(n-1)", "x^(n+1)/(n+1)", "n*x^n", "ln(x)"], correct: 0 },
    { q: "What is the derivative of e^x?", a: ["e^x", "ln(x)", "x*e^(x-1)", "1/x"], correct: 0 },
    { q: "The area under a curve is found using which operation?", a: ["Derivative", "Limit", "Integral", "Logarithm"], correct: 2 },
    { q: "What is the derivative of ln(x)?", a: ["1/x", "e^x", "x", "log(x)"], correct: 0 },
    { q: "L'Hopital's Rule is used to evaluate what?", a: ["Integrals", "Indeterminate limits", "Differential equations", "Infinite series"], correct: 1 },
    { q: "The derivative of a constant is always?", a: ["1", "The constant itself", "0", "Undefined"], correct: 2 },
    { q: "The Chain Rule is used for finding the derivative of what?", a: ["Products", "Quotients", "Composite functions", "Sums"], correct: 2 },
    { q: "Who published the first proof of the Fundamental Theorem of Calculus?", a: ["Isaac Barrow", "Newton", "Leibniz", "Cauchy"], correct: 0 }
  ],
  "Frontend Technologies": [
    { q: "Which hook is used for side effects in React?", a: ["useState", "useEffect", "useContext", "useMemo"], correct: 1 },
    { q: "What does CSS stand for?", a: ["Cascading Style Sheets", "Creative Style System", "Computer Style Syntax", "Complex Style Sheets"], correct: 0 },
    { q: "Which HTML tag is used for an unordered list?", a: ["<ol>", "<li>", "<ul>", "<list>"], correct: 2 },
    { q: "What is the default layout of Flexbox?", a: ["Column", "Row", "Grid", "Inline"], correct: 1 },
    { q: "Which company developed the TypeScript language?", a: ["Google", "Facebook", "Microsoft", "Amazon"], correct: 2 },
    { q: "What is the primary purpose of a 'Virtual DOM'?", a: ["Increase security", "Optimize rendering", "Store metadata", "Enable SSR"], correct: 1 },
    { q: "Which property controls the stacking order of elements?", a: ["position", "opacity", "z-index", "display"], correct: 2 },
    { q: "What does 'SASS' refer to?", a: ["CSS Preprocessor", "JS Framework", "Database Type", "Build Tool"], correct: 0 },
    { q: "Which React hook returns a memoized value?", a: ["useCallback", "useMemo", "useRef", "useReducer"], correct: 1 },
    { q: "What is 'Hoisting' in JavaScript?", a: ["Variable lifting", "Network fetching", "DOM removal", "Array sorting"], correct: 0 },
    { q: "Which attribute is used to uniquely identify an element?", a: ["class", "id", "name", "tag"], correct: 1 },
    { q: "What is the purpose of 'Next.js'?", a: ["Mobile apps", "Server-Side Rendering", "Vector graphics", "Testing"], correct: 1 },
    { q: "Which HTTP method is typically used to update a resource?", a: ["GET", "POST", "PUT", "DELETE"], correct: 2 },
    { q: "What does 'Tailwind CSS' focus on?", a: ["Pre-built themes", "Utility-first classes", "JS integration", "Shadow DOM"], correct: 1 },
    { q: "Which tool is used for version control?", a: ["npm", "Vite", "Git", "Webpack"], correct: 2 }
  ],
  "Python Programming": [
    { q: "Which keyword is used for functions?", a: ["func", "def", "define", "fn"], correct: 1 },
    { q: "How do you start a comment in Python?", a: ["//", "/*", "#", "--"], correct: 2 },
    { q: "Which data type is immutable?", a: ["List", "Dictionary", "Tuple", "Set"], correct: 2 },
    { q: "What is the purpose of the 'pip' command?", a: ["Execute code", "Install packages", "Debugging", "Formatting"], correct: 1 },
    { q: "How do you check the type of an object?", a: ["typeof()", "type()", "isinstance()", "kind()"], correct: 1 },
    { q: "Which function is used to add an item to the end of a list?", a: ["push()", "insert()", "append()", "add()"], correct: 2 },
    { q: "What is the correct way to handle exceptions in Python?", a: ["try/except", "catch/finally", "error/handle", "attempt/trap"], correct: 0 },
    { q: "Which operator is used for exponentiation (2^3)?", a: ["^", "**", "&&", "//"], correct: 1 },
    { q: "What result does 'bool(0)' return?", a: ["True", "False", "None", "Error"], correct: 1 },
    { q: "Which module in Python is used for regular expressions?", a: ["regex", "re", "regex_py", "str"], correct: 1 },
    { q: "What is a 'decorator' in Python?", a: ["UI element", "Function modifying another function", "Variable type", "Data structure"], correct: 1 },
    { q: "Which method is used to remove whitespace from both ends of a string?", a: ["strip()", "clean()", "trim()", "clear()"], correct: 0 },
    { q: "Python is primarily what type of language?", a: ["Compiled", "Interpreted", "Low-level", "Machine"], correct: 1 },
    { q: "What does PEP 8 refer to?", a: ["Core logic", "Formatting guidelines", "Testing framework", "API standard"], correct: 1 },
    { q: "Which data structure stores key-value pairs?", a: ["List", "Set", "Dictionary", "Tuple"], correct: 2 }
  ],
  "Generative AI": [
     { q: "What does LLM stand for?", a: ["Large Language Model", "Linear Logic Machine", "Local Learning Module", "Linked Language Map"], correct: 0 },
     { q: "Which architecture is the foundation of GPT models?", a: ["RNN", "CNN", "Transformer", "GAN"], correct: 2 },
     { q: "What is 'Hallucination' in GenAI?", a: ["User error", "Generating false info", "Optical illusion", "Data encryption"], correct: 1 },
     { q: "Which company developed the 'Gemini' models?", a: ["OpenAI", "Meta", "Google", "Microsoft"], correct: 2 },
     { q: "What is 'Zero-Shot Prompting'?", a: ["No examples provided", "One example provided", "Fast generation", "Low accuracy"], correct: 0 },
     { q: "Which technique uses vector databases to ground AI responses?", a: ["Fine-tuning", "RAG", "RLHF", "Backpropagation"], correct: 1 },
     { q: "What does 'GAN' stand for?", a: ["Generative Adversarial Network", "General AI Node", "Global Adaptive Network", "Graph Analysis Network"], correct: 0 },
     { q: "What is the purpose of 'Diffusion Models'?", a: ["Text classification", "Image generation", "Data sorting", "Algorithm optimization"], correct: 1 },
     { q: "In GenAI, what represents the input sequence?", a: ["Weights", "Biases", "Tokens", "Layers"], correct: 2 },
     { q: "What is 'Temperature' in LLM generation?", a: ["Hardware heat", "Randomness control", "Process speed", "Model size"], correct: 1 },
     { q: "Which part of the Transformer focuses on relevant input parts?", a: ["Dropout", "Attention", "Normalization", "Flattening"], correct: 1 },
     { q: "What is 'Context Window'?", a: ["Max input length", "Screen size", "UI layout", "Training time"], correct: 0 },
     { q: "Which method aligns models with human preferences?", a: ["GDPR", "RLHF", "SMTP", "JSON"], correct: 1 },
     { q: "What is a 'Parameter' in AI?", a: ["Variable learned during training", "User setting", "Input data", "Model name"], correct: 0 },
     { q: "What does 'BPE' stand for in tokenization?", a: ["Byte-Pair Encoding", "Binary Process Engine", "Base Prompt Editor", "Back-Prop Element"], correct: 0 }
  ],
  "Machine Learning": [
     { q: "Which type of learning uses labeled data?", a: ["Unsupervised", "Supervised", "Reinforcement", "Clustering"], correct: 1 },
     { q: "What is 'Overfitting'?", a: ["Model is too simple", "Model fits noise instead of pattern", "Data is missing", "Training is fast"], correct: 1 },
     { q: "Which algorithm is commonly used for classification?", a: ["Linear Regression", "K-Means", "Random Forest", "PCA"], correct: 2 },
     { q: "What does 'Bias' represent in ML?", a: ["Preprocessing error", "Underlying assumptions", "Data leakage", "Gradient descent"], correct: 1 },
     { q: "Which technique is used to reduce dimensionality?", a: ["SVM", "PCA", "CNN", "KNN"], correct: 1 },
     { q: "What is the 'Loss Function'?", a: ["Measure of error", "Memory leakage", "Data compression", "Feature removal"], correct: 0 },
     { q: "Which part of data is used to evaluate final performance?", a: ["Training set", "Validation set", "Test set", "Batch set"], correct: 2 },
     { q: "What is a 'Neuron' in Neural Networks?", a: ["A biological cell", "A mathematical function", "A database entry", "A storage unit"], correct: 1 },
     { q: "Which activation function is widely used in hidden layers?", a: ["Sigmoid", "Softmax", "ReLU", "Tanh"], correct: 2 },
     { q: "What is 'Cross-Validation'?", a: ["Merging datasets", "Model testing technique", "Data encryption", "Algorithm switching"], correct: 1 },
     { q: "What does 'Backpropagation' do?", a: ["Feature engineering", "Gradient calculation", "Data collection", "Model deployment"], correct: 1 },
     { q: "Which ML branch focuses on reward maximization?", a: ["Deep Learning", "Supervised", "Reinforcement", "Bayesian"], correct: 2 },
     { q: "What is a 'Hyperparameter'?", a: ["Setting fixed before training", "Weight learned in training", "High-speed data", "Large model"], correct: 0 },
     { q: "The 'Mean Squared Error' is used for which tasks?", a: ["Classification", "Regression", "Clustering", "Ranking"], correct: 1 },
     { q: "Which library is common for ML in Python?", a: ["React", "Express", "Scikit-Learn", "Vite"], correct: 2 }
  ]
};

export default function Quiz({ onComplete }: { onComplete: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = (index: number) => {
    const questions = QUESTION_POOL[selectedTopic!];
    if (index === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTopic) return;
    const questionsList = QUESTION_POOL[selectedTopic];
    if (!questionsList || questionsList.length === 0) {
      console.error("Critical integrity error: Attempted to submit score for empty module.");
      return;
    }

    setIsSubmitting(true);
    const finalScore = (score / questionsList.length) * 100;

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic, score: finalScore })
      });

      if (!res.ok) {
        throw new Error(`Data write failed: ${res.status}`);
      }
      
      onComplete();
    } catch (err) {
      console.error("Metric persistence failure", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedTopic) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicSelect(topic)}
            className="bg-surface border border-border p-8 rounded-xl text-left hover:border-accent/50 hover:bg-accent/5 transition-all group flex flex-col"
          >
            <div className="w-10 h-10 bg-bg border border-border rounded flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors">
               <BookOpen className="w-4 h-4 text-text-dim group-hover:text-accent" />
            </div>
            <h3 className="font-serif text-xl italic mb-2 tracking-tight">{topic}</h3>
            <p className="text-text-secondary text-xs mb-6 opacity-80 italic">Assessment of core principles and advanced applications.</p>
            <div className="mt-auto flex items-center gap-2 text-accent text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Select Assessment <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    );
  }

  const questions = selectedTopic ? (QUESTION_POOL[selectedTopic] || []) : [];
  const question = questions[currentQuestion] || null;

  if (selectedTopic && !showResult && (!questions.length || !question)) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-serif italic mb-4">Assessment Data Mismatch</h3>
        <p className="text-text-secondary text-sm mb-8">The requested assessment module could not be initialized or contains insufficient data.</p>
        <button 
          onClick={() => setSelectedTopic(null)}
          className="px-8 py-2 bg-accent text-white rounded font-bold uppercase text-[10px] tracking-widest"
        >
          Return to Selection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={`${selectedTopic}-${currentQuestion}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-surface border border-border rounded-xl p-10 md:p-12 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-border">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex justify-between items-center mb-10 border-b border-border/50 pb-4">
               <span className="text-[10px] uppercase font-bold tracking-widest text-accent">{selectedTopic}</span>
               <span className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Step 0{currentQuestion + 1} / 0{questions.length}</span>
            </div>
            
            <h2 className="text-2xl font-serif italic mb-10 leading-tight">"{question.q}"</h2>
            
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={{
                show: { transition: { staggerChildren: 0.05 } }
              }}
              initial="hidden"
              animate="show"
            >
              {question.a.map((option, i) => (
                <motion.button
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left px-6 py-4 rounded-lg bg-bg border border-border hover:border-accent/50 transition-all text-sm font-medium flex items-center gap-4 group"
                >
                  <span className="text-text-dim italic font-serif group-hover:text-accent transition-colors">0{i + 1}.</span>
                  {option}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="bg-surface border border-border rounded-xl p-12 text-center overflow-hidden relative"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
              className="w-16 h-16 bg-accent-soft border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
               <CheckCircle2 className="w-8 h-8 text-accent" />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[2rem] font-serif italic mb-4"
            >
              Assessment Finalized
            </motion.h2>

            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="text-6xl font-serif italic text-accent mb-8"
            >
               {((score / questions.length) * 100).toFixed(0)}%
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-text-secondary mb-10 max-w-sm mx-auto leading-relaxed italic text-sm"
            >
              Your results have been logged to the persistence layer. The ML model will now refine your predicted mastery trajectory.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-12 py-3.5 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-md transition-all uppercase text-[11px] tracking-widest shadow-lg shadow-accent/20"
            >
              {isSubmitting ? "Processing Data..." : "Apply ML Metrics & Return"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
