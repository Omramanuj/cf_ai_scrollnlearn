import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRoutes from "./routes/contentRoute";
import connectDB from "./config/db";


const app = express();
const corsOptions = {
  origin: ['http://localhost:3000', 'https://scrollnlearn.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
connectDB().then(() => {
  console.log('Database connection established');
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

app.use(express.json());
app.use("/api",contentRoutes)


app.get("/ping", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node!");
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ping-pong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
