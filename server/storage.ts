import { users, plans, type User, type InsertUser, type Plan, type InsertPlan } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByGithubId(githubId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPlans(userId: number): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, plan: Partial<InsertPlan>): Promise<Plan>;
  deletePlan(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.githubId, githubId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPlans(userId: number): Promise<Plan[]> {
    return db.select().from(plans).where(eq(plans.userId, userId));
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan;
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const [plan] = await db
      .insert(plans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async updatePlan(id: number, updatePlan: Partial<InsertPlan>): Promise<Plan> {
    const [plan] = await db
      .update(plans)
      .set(updatePlan)
      .where(eq(plans.id, id))
      .returning();

    if (!plan) {
      throw new Error("Plan not found");
    }

    return plan;
  }

  async deletePlan(id: number): Promise<void> {
    await db.delete(plans).where(eq(plans.id, id));
  }
}

export const storage = new DatabaseStorage();