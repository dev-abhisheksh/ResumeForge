import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./modules/auth/auth.route.js";
import resumeRouter from "./modules/resume/resume.route.js";
import resumeAnalysisRouter from "./modules/resume-analysis/resume-analysis.route.js";
import projectRouter from "./modules/project/project.route.js"
import "./workers/resume.worker.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(helmet()); // Security headers
app.use(compression()); // Gzip responses
app.use(express.json()); // Parse JSON
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // Request logging

// Routes
app.use("/auth", authRouter);
app.use("/resume", resumeRouter);
app.use("/resume-analysis", resumeAnalysisRouter);
app.use("/project", projectRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
