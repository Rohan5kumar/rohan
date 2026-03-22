import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API for projects
  app.get("/api/projects", (_req, res) => {
    res.json([
      {
        id: "ai-chatbot",
        title: "Gemini AI Assistant",
        description: "A real-time AI chatbot powered by Google's Gemini Pro model.",
        tech: ["Vanilla JS", "Gemini API", "Tailwind"],
        image: "https://picsum.photos/seed/ai/800/600"
      },
      {
        id: "task-manager",
        title: "TaskFlow Pro",
        description: "Full-stack task management system with drag-and-drop features.",
        tech: ["Vanilla JS", "Express", "SQLite"],
        image: "https://picsum.photos/seed/tasks/800/600"
      },
      {
        id: "weather-app",
        title: "SkyCast",
        description: "Dynamic weather dashboard with real-time data and forecasts.",
        tech: ["Vanilla JS", "OpenWeather API", "Recharts"],
        image: "https://picsum.photos/seed/weather/800/600"
      },
      {
        id: "expense-tracker",
        title: "WealthWise",
        description: "Personal finance tracker with data visualization and analytics.",
        tech: ["Vanilla JS", "Recharts", "LocalStorage"],
        image: "https://picsum.photos/seed/finance/800/600"
      },
      {
        id: "markdown-editor",
        title: "GhostPad",
        description: "Minimalist markdown editor with real-time preview and export.",
        tech: ["Vanilla JS", "Markdown", "Tailwind"],
        image: "https://picsum.photos/seed/editor/800/600"
      }
    ]);
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
