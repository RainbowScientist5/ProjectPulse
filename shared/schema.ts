import { pgTable, text, serial, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  githubId: text("github_id").notNull().unique(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
  accessToken: text("access_token").notNull(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  content: json("content").notNull().$type<InfrastructureContent>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InfrastructureContent = {
  components: {
    id: string;
    type: 'server' | 'network' | 'storage';
    name: string;
    specs: Record<string, string>;
    position: { x: number; y: number };
  }[];
  connections: {
    id: string;
    from: string;
    to: string;
    type: string;
  }[];
};

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
