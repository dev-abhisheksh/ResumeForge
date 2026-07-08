import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

//Routes

app.use(notFound);
app.use(errorHandler);

export default app;
