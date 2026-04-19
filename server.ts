
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ quizzes: [] }, null, 2));
  }
}

async function readData() {
  const content = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(content);
}

async function writeData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Simple Linear Regression for Mastery Score
// Returns the predicted score for the next attempt
function calculateMasteryPredictiveScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  if (scores.length === 1) return scores[0];

  const n = scores.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i; // Time/Attempt index
    const y = scores[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Predict score for attempt n (the next one)
  const prediction = slope * n + intercept;
  
  // Clamp prediction between 0 and 100
  return Math.min(100, Math.max(0, prediction));
}

async function startServer() {
  await initDataFile();
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = await readData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/quiz", async (req, res) => {
    try {
      const { topic, score } = req.body;
      if (!topic || score === undefined) {
        return res.status(400).json({ error: "Topic and score are required" });
      }

      const data = await readData();
      data.quizzes.push({
        topic,
        score,
        timestamp: Date.now(),
      });
      await writeData(data);
      res.json({ message: "Quiz result saved", data });
    } catch (error) {
      res.status(500).json({ error: "Failed to save quiz result" });
    }
  });

  app.post("/api/reset", async (req, res) => {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify({ quizzes: [] }, null, 2));
      res.json({ message: "Progress reset successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reset progress" });
    }
  });

  app.get("/api/mastery", async (req, res) => {
    try {
      const data = await readData();
      const topics: Record<string, number[]> = {};
      const ALL_TOPICS = ["Calculus", "Frontend Technologies", "Python Programming", "Generative AI", "Machine Learning"];

      data.quizzes.forEach((q: any) => {
        if (!topics[q.topic]) topics[q.topic] = [];
        topics[q.topic].push(q.score);
      });

      const mastery: Record<string, { current: number, predicted: number, count: number }> = {};
      let lowestScore = 101;
      let recommendedTopic = ALL_TOPICS[0];

      // Initialize all topics if not present
      ALL_TOPICS.forEach(topic => {
        const scores = topics[topic] || [];
        const predicted = calculateMasteryPredictiveScore(scores);
        mastery[topic] = {
          current: scores.length > 0 ? scores[scores.length - 1] : 0,
          predicted: predicted,
          count: scores.length
        };

        if (predicted < lowestScore) {
          lowestScore = predicted;
          recommendedTopic = topic;
        }
      });

      res.json({ mastery, recommendation: recommendedTopic });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate mastery" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
