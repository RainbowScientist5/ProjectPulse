import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlanSchema, insertUserSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Auth routes
  app.post("/api/auth/github", async (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const existingUser = await storage.getUserByGithubId(parsed.data.githubId);
    if (existingUser) {
      return res.json(existingUser);
    }

    const user = await storage.createUser(parsed.data);
    return res.json(user);
  });

  // Plan routes  
  app.get("/api/plans", async (req, res) => {
    const userId = Number(req.query.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const plans = await storage.getPlans(userId);
    return res.json(plans);
  });

  app.get("/api/plans/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const plan = await storage.getPlan(id);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    return res.json(plan);
  });

  app.post("/api/plans", async (req, res) => {
    const parsed = insertPlanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const plan = await storage.createPlan(parsed.data);
    return res.json(plan);
  });

  app.patch("/api/plans/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    const parsed = insertPlanSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const plan = await storage.updatePlan(id, parsed.data);
    return res.json(plan);
  });

  app.delete("/api/plans/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    await storage.deletePlan(id);
    return res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
