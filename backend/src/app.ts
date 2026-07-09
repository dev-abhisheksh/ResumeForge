import express from "express";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin requests
app.use(compression()); // Gzip responses
app.use(express.json()); // Parse JSON
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // Request logging

//Routes

app.use(notFound);
app.use(errorHandler);

export default app;
