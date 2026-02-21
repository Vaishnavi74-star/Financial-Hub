import { db } from "./db";
import { users, transactions, budgets, savingsGoals, type User, type InsertUser, type Transaction, type InsertTransaction, type Budget, type InsertBudget, type SavingsGoal, type InsertSavingsGoal } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(userId: number, transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, userId: number, updates: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number, userId: number): Promise<boolean>;

  getBudgets(userId: number): Promise<Budget[]>;
  createBudget(userId: number, budget: InsertBudget): Promise<Budget>;
  deleteBudget(id: number, userId: number): Promise<boolean>;

  getSavingsGoals(userId: number): Promise<SavingsGoal[]>;
  createSavingsGoal(userId: number, goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: number, userId: number, updates: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: number, userId: number): Promise<boolean>;

  getMonthlyReport(userId: number): Promise<any[]>;
  getCategoryReport(userId: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.date));
  }
  async createTransaction(userId: number, transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values({ ...transaction, userId }).returning();
    return newTransaction;
  }
  async updateTransaction(id: number, userId: number, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updated] = await db.update(transactions)
      .set(updates)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return updated;
  }
  async deleteTransaction(id: number, userId: number): Promise<boolean> {
    const [deleted] = await db.delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();
    return !!deleted;
  }

  async getBudgets(userId: number): Promise<Budget[]> {
    return await db.select().from(budgets).where(eq(budgets.userId, userId));
  }
  async createBudget(userId: number, budget: InsertBudget): Promise<Budget> {
    const [newBudget] = await db.insert(budgets).values({ ...budget, userId }).returning();
    return newBudget;
  }
  async deleteBudget(id: number, userId: number): Promise<boolean> {
    const [deleted] = await db.delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return !!deleted;
  }

  async getSavingsGoals(userId: number): Promise<SavingsGoal[]> {
    return await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId));
  }
  async createSavingsGoal(userId: number, goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const [newGoal] = await db.insert(savingsGoals).values({ ...goal, userId }).returning();
    return newGoal;
  }
  async updateSavingsGoal(id: number, userId: number, updates: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined> {
    const [updated] = await db.update(savingsGoals)
      .set(updates)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();
    return updated;
  }
  async deleteSavingsGoal(id: number, userId: number): Promise<boolean> {
    const [deleted] = await db.delete(savingsGoals)
      .where(and(eq(savingsGoals.id, id), eq(savingsGoals.userId, userId)))
      .returning();
    return !!deleted;
  }

  async getMonthlyReport(userId: number): Promise<any[]> {
    const results = await db.execute(sql`
      SELECT TO_CHAR(date, 'YYYY-MM') as month, type, CAST(SUM(amount) AS FLOAT) as total
      FROM transactions
      WHERE user_id = ${userId}
      GROUP BY month, type
      ORDER BY month DESC
    `);
    return results.rows;
  }
  async getCategoryReport(userId: number): Promise<any[]> {
    const results = await db.execute(sql`
      SELECT category, type, CAST(SUM(amount) AS FLOAT) as total
      FROM transactions
      WHERE user_id = ${userId}
      GROUP BY category, type
    `);
    return results.rows;
  }
}

export const storage = new DatabaseStorage();