import cors from "cors";
import express, { Request, Response } from "express";
import { gymsByGeneration } from "./data/gyms";
import { typeChart } from "./data/type-chart";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/types/chart", (_req: Request, res: Response) => {
  res.json({ chart: typeChart, typeCount: Object.keys(typeChart).length });
});

app.get("/api/gyms", (req: Request, res: Response) => {
  const generation = Number(req.query.generation);

  if (!Number.isInteger(generation) || generation < 1 || generation > 9) {
    res.status(400).json({
      error: "generation must be an integer between 1 and 9",
    });
    return;
  }

  res.json(gymsByGeneration[generation]);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
