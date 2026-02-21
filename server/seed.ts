import { db } from "./db";
import { users, transactions } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");
  try {
    // Check if we already have users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Insert demo user
    const [user] = await db.insert(users).values({
      username: "demo",
      password: "password123", // normally hashed
    }).returning();

    // Insert demo transactions
    await db.insert(transactions).values([
      {
        userId: user.id,
        type: "income",
        amount: "5000",
        category: "Salary",
        description: "Monthly salary",
        date: new Date(new Date().setDate(new Date().getDate() - 5)),
      },
      {
        userId: user.id,
        type: "expense",
        amount: "1200",
        category: "Housing",
        description: "Rent payment",
        date: new Date(new Date().setDate(new Date().getDate() - 4)),
      },
      {
        userId: user.id,
        type: "expense",
        amount: "150",
        category: "Utilities",
        description: "Electric bill",
        date: new Date(new Date().setDate(new Date().getDate() - 3)),
      },
      {
        userId: user.id,
        type: "expense",
        amount: "300",
        category: "Food",
        description: "Groceries",
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
      {
        userId: user.id,
        type: "income",
        amount: "200",
        category: "Side Hustle",
        description: "Freelance project",
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
      }
    ]);
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed().catch(console.error).then(() => process.exit(0));
