import { User, InsertUser, Plan, InsertPlan } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  private userId: number;
  private planId: number;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.userId = 1;
    this.planId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByGithubId(githubId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.githubId === githubId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPlans(userId: number): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter(plan => plan.userId === userId);
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = this.planId++;
    const plan: Plan = {
      ...insertPlan,
      id,
      createdAt: new Date()
    };
    this.plans.set(id, plan);
    return plan;
  }

  async updatePlan(id: number, updatePlan: Partial<InsertPlan>): Promise<Plan> {
    const existing = await this.getPlan(id);
    if (!existing) throw new Error("Plan not found");
    
    const updated: Plan = {
      ...existing,
      ...updatePlan,
    };
    this.plans.set(id, updated);
    return updated;
  }

  async deletePlan(id: number): Promise<void> {
    this.plans.delete(id);
  }
}

export const storage = new MemStorage();
